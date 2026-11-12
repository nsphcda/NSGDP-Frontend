export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/**
 * Real user testimonials for the About page. Empty on purpose: the previous
 * entries were placeholder quotes attributed to invented people, so the section
 * stays hidden until real, attributed quotes are added here. Keep each quote
 * short (three lines at most) and always include name and role.
 *
 * The removed placeholders are in git history if they are ever needed for a
 * layout test.
 */
export const TESTIMONIALS: Testimonial[] = [];
