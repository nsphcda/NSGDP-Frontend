import type { VideoTutorial } from "./types";

// Fallback used only when the Learning Hub API cannot be reached. Videos without a
// recording are not shown to readers; the real catalogue is edited in the admin portal.
export const VIDEOS: VideoTutorial[] = [
  {
    id: "v-upload",
    title: "Upload a dataset",
    description:
      "Walk through the upload wizard from a tidy CSV to Submit for review: basic info, coverage, files, governance, contact and visibility.",
    duration: "14:00",
    category: "contribute",
    guide: "upload-your-first-dataset",
    featured: true,
    status: "coming-soon",
  },
  {
    id: "v-analytics",
    title: "Reading the analytics dashboard",
    description:
      "Switch measure kind and indicator, read the summary cards and charts, check ward-level data and outliers, then filter by development partner and export to CSV.",
    duration: "17:00",
    category: "explore",
    guide: "read-the-analytics-dashboard",
    status: "coming-soon",
  },
  {
    id: "v-maps",
    title: "Which map should I use?",
    description:
      "What each map is for (dataset coverage, population, facilities and settlements) and how to filter each one.",
    duration: "10:00",
    category: "gis",
    guide: "use-the-maps",
    status: "coming-soon",
  },
];
