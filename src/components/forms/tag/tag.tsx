import { XSmallIcon } from "@/components/common/icons";
import "./tag.css";

type TagProps = {
  onRemove: () => void;
  children: string;
};

const Tag = (props: TagProps) => {
  return (
    <span className="tag">
      <span className="">{props.children}</span>
      <button onClick={props.onRemove} className="tag-button">
        <XSmallIcon className="tag-button-close-icon" />
      </button>
    </span>
  );
};
export default Tag;
