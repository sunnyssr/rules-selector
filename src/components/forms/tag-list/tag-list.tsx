import "./tag-list.css";
import Tag from "../tag/tag";

type TagListProps = {
  onRemove: (tag: string) => void;
  tags: string[];
};

const TagList = (props: TagListProps) => {
  return (
    <ul className="tag-list">
      {props.tags.map((tag) => (
        <Tag key={tag} onRemove={() => props.onRemove(tag)}>
          {tag}
        </Tag>
      ))}
    </ul>
  );
};
export default TagList;
