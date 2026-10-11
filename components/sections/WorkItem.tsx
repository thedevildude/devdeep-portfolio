import Image from "next/image";
import Section from "@/components/ui/Section";

type WorkItemProps = {
  id: string;
  title: string;
  category: string;
  image: string;
};

const WorkItem = ({ id, title, category, image }: WorkItemProps) => (
  <Section id={id}>
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-border">
        <Image src={image} alt={title} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="mt-6 flex items-baseline justify-between">
        <h3 className="text-3xl font-semibold tracking-tight">{title}</h3>
        <span className="text-sm text-muted">{category}</span>
      </div>
    </div>
  </Section>
);

export default WorkItem;
