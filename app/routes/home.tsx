import type { Route } from "./+types/home";
import { WeekPlanner } from "../welcome/week-planner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Week Planner" },
    { name: "description", content: "A flexible weekly planner" },
  ];
}

export default function Home() {
  return <WeekPlanner />;
}
