import Link from "next/link";
import LostRobot from "./components/LostRobot";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main id="main-content" className="page shell">
      <h1 className="page-title">Not found</h1>
      <p className="section-lede">
        Nothing lives at this address. Going by the footprints, the robot has been looking for it for some time.
      </p>
      <LostRobot />
      <p className="lost-way">
        Or skip the walk: <Link href="/">go home</Link>, or look through <Link href="/projects">the work</Link>.
      </p>
    </main>
  );
}
