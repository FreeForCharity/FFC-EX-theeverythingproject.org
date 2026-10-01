import { team, type TeamMember } from '../../src/data/team'
import { isPending } from '../../src/lib/site.config'

// A fork whose team the charity has not supplied yet lists 'team' in
// siteConfig.pending and ships an EMPTY roster (never the template's FFC
// staff); the per-member checks then have nothing to check.
const placeholderRow: TeamMember = { name: '', role: '' }
const itEachMember = team.length > 0 ? it.each(team) : it.skip.each([placeholderRow])

describe('Team data integrity', () => {
  // The roster is per-charity content, so its SIZE and its NAMES are not
  // asserted -- a rebrand replaces both. What must hold for every fork is that
  // the roster is non-empty (TheFreeForCharityTeam renders an empty-state
  // otherwise, covered in that component's own suite) and well-formed.
  it('should have at least one team member, unless the team is pending', () => {
    if (isPending('team')) expect(team).toHaveLength(0)
    else expect(team.length).toBeGreaterThan(0)
  })

  itEachMember('team member "$name" should have required fields', (member) => {
    expect(member.name).toBeDefined()
    expect(typeof member.name).toBe('string')
    expect(member.name.trim().length).toBeGreaterThan(0)

    expect(member.role).toBeDefined()
    expect(typeof member.role).toBe('string')
    expect(member.role.trim().length).toBeGreaterThan(0)

    // Photos were removed in favor of initials monograms — no imageUrl field.
    expect('imageUrl' in member).toBe(false)

    // linkedinUrl is optional; when set it must be an https:// URL on
    // linkedin.com (or a subdomain) — the only shape TeamMemberCard turns into
    // a link (safeLinkedInUrl). Enforcing the host here means bad data fails
    // the suite instead of silently rendering as a non-link.
    if (member.linkedinUrl !== undefined) {
      expect(member.linkedinUrl).toMatch(/^https:\/\/([a-z0-9-]+\.)*linkedin\.com(\/|$)/i)
    }
  })

  it('should have no duplicate names', () => {
    const names = team.map((m) => m.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('should carry a non-placeholder name and role for every member', () => {
    // Catches the half-finished rebrand: JSON copied from the template and
    // renamed to the new charity's file name, but never filled in.
    const placeholders = [/^your name$/i, /^full name$/i, /^team member$/i, /^tbd$/i, /^todo$/i]
    for (const member of team) {
      for (const placeholder of placeholders) {
        expect(member.name).not.toMatch(placeholder)
        expect(member.role).not.toMatch(placeholder)
      }
    }
  })
})
