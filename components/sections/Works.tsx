import { WORKS } from "@/lib/constants";
import WorkItem from "./WorkItem";

const Works = () => (
  <div id="work">
    {WORKS.map((work) => (
      <WorkItem key={work.id} {...work} />
    ))}
  </div>
);

export default Works;
