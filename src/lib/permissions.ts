import type { Student, Role } from "@lib/data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WHO CAN DO WHAT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One place where each role's powers are decided. This used to be
 * `student.role !== "admin"` written into the middleware and into the panel; it
 * worked, but it is the worst-ageing way to check a permission: the day a third
 * role appears you have to hunt down every loose comparison in the repository,
 * and the one you miss is a hole.
 *
 * ─── THE THREE ROLES, AND WHY THERE ARE ONLY THREE ─────────────────────────
 *
 *   · STUDENT — bought the course. Sees the two doors and nothing else.
 *   · AGENT   — sells. Registers the people who buy from them and sends them
 *               their link. Sees THEIR OWN list, not the business's.
 *   · ADMIN   — Pedro. Sees everything and can do everything.
 *
 * Each one is the previous one plus something. That is what lets all three come
 * in through the same door with the same form: the role decides what gets
 * rendered, never how someone authenticates. A second sign-in screen for staff
 * would be a second thing to keep safe, for no gain.
 *
 * ─── THE TWO LINES AN AGENT DOES NOT CROSS ─────────────────────────────────
 *
 * 1. AN AGENT DOESN'T SEE OTHER PEOPLE'S STUDENTS. Their list is filtered by
 *    `registeredBy`, in the query, not in the template. The full customer list
 *    is the business's most valuable asset and the one thing that walks out the
 *    door with somebody who stops working here.
 *
 * 2. AN AGENT DOESN'T DEACTIVATE ANYBODY. A deactivation is a refund, and a
 *    refund is money. They ask Pedro. This is the cautious default: loosening it
 *    later is one line here, and it stops an argument with a customer from
 *    ending in somebody losing access to what they paid for.
 *
 * What an agent CAN do with their own students — register them and resend their
 * link — is exactly the everyday work, which is why it doesn't go through Pedro.
 */

/** Every role that exists, ordered from least to most power. */
export const ROLES = ["student", "agent", "admin"] as const;

/** Roles that can open the staff panel at all. */
const STAFF_ROLES: readonly Role[] = ["agent", "admin"];

/**
 * Can they administer the area? See every student, deactivate, reactivate,
 * decide somebody's role.
 *
 * This is the STRONG permission: whoever has it sees everybody's data.
 */
export function canAdminister(student: Student | null | undefined): boolean {
  return student?.role === "admin";
}

/**
 * Can they register a new student?
 *
 * This is the WEAK permission: it creates an account and sends its link, and
 * grants nothing over accounts somebody else created. It is what an agent's job
 * is made of.
 */
export function canAddStudents(student: Student | null | undefined): boolean {
  return !!student && STAFF_ROLES.includes(student.role);
}

/**
 * Can they even open `/admin`?
 *
 * Either permission is enough: the panel shows whatever matches each one. The
 * middleware uses this, since it is what decides whether the route exists.
 */
export function canOpenStaffPanel(student: Student | null | undefined): boolean {
  return canAdminister(student) || canAddStudents(student);
}

/**
 * Which students does this person get to see?
 *
 * ⚠️ THE ANSWER IS A QUERY FILTER, NOT A TEMPLATE CONDITION. `null` means "all
 * of them"; an id means "only the ones this person registered". It is handed
 * straight to the repository so the rows an agent may not see are never loaded,
 * never serialised and never one `{JSON.stringify}` away from the page. A list
 * you filter while painting it is a list you have already sent.
 */
export function visibleStudentsFilter(
  student: Student,
): { registeredBy: string } | null {
  return canAdminister(student) ? null : { registeredBy: student.id };
}

/**
 * Can `actor` act on `target` — resend their link, and nothing else for now?
 *
 * An admin, on anyone. An agent, only on the people they registered themselves.
 * Never on themselves through the panel: the way to get your own link is the
 * "I forgot my password" on the sign-in screen, which is rate limited by email
 * and doesn't need anybody's permission.
 */
export function canManageStudent(
  actor: Student | null | undefined,
  target: Pick<Student, "id" | "registeredBy">,
): boolean {
  if (!actor || actor.id === target.id) return false;
  if (canAdminister(actor)) return true;
  return canAddStudents(actor) && target.registeredBy === actor.id;
}

/**
 * Do they get the two course doors — the CRM and the Academy?
 *
 * ⚠️ ONLY A PLAIN STUDENT. Not the agent, and not the admin either.
 *
 * The reason is the same for both: whoever opens this portal to WORK opens it to
 * do something to other people's accounts, and two big cards about the course
 * sitting above their tools is two thirds of the screen spent on somebody else's
 * homework. An agent sells. Pedro runs the business. Neither comes here to watch
 * video 7 — and if they ever want to, they are one sign-in away from their own
 * student account or one line away from changing this.
 *
 * It is a rule and not a template condition precisely so that changing it back
 * is that one line, rather than a hunt through the pages.
 */
export function seesCourseDoors(student: Student | null | undefined): boolean {
  return student?.role === "student";
}

/**
 * Can they deactivate and reactivate accounts? Admin only — see the note above.
 */
export function canDeactivate(student: Student | null | undefined): boolean {
  return canAdminister(student);
}

/**
 * Can `actor` change `target`'s role?
 *
 * Admin only, and with two locks that exist to stop the panel from locking
 * everybody out of itself:
 *
 *  1. NOT ON YOURSELF. Demoting yourself by accident means the panel closes
 *     behind you and there is nobody left who can undo it.
 *  2. NOT ON A BOOTSTRAP ADMIN — one of the addresses in `ADMIN_EMAILS`. That
 *     list is the recovery hatch: whoever is on it is admin by configuration,
 *     and letting the panel demote them would leave the recovery hatch shut
 *     while looking like it worked.
 *
 * The second one is passed in rather than read here so this file keeps knowing
 * nothing about environment variables: it decides rules, not configuration.
 */
export function canChangeRole(
  actor: Student | null | undefined,
  target: Pick<Student, "id">,
  targetIsBootstrapAdmin: boolean,
): boolean {
  if (!canAdminister(actor)) return false;
  if (actor!.id === target.id) return false;
  return !targetIsBootstrapAdmin;
}

/**
 * Which roles can this person hand out when registering somebody?
 *
 * ⚠️ AN AGENT CAN ONLY CREATE STUDENTS, and this is where that is enforced —
 * not by leaving the selector out of the form. A `<select>` that isn't painted
 * is not a rule: the form is a POST, and a POST can be sent by hand with any
 * value in it. The panel checks what it receives against this list.
 */
export function assignableRoles(student: Student | null | undefined): Role[] {
  if (canAdminister(student)) return ["student", "agent", "admin"];
  if (canAddStudents(student)) return ["student"];
  return [];
}
