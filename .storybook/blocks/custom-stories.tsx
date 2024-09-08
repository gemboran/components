import {FC, ReactElement, useContext} from "react";
import {DocsContext, Heading} from "@storybook/blocks";
import {CodeSnippetBlock} from "./code-snippet.block";

type StoriesProps = {
  title?: ReactElement | string;
  includePrimary?: boolean;
}

const CustomStories: FC<StoriesProps> = ({title = "Usages", includePrimary = true}) => {
  const {componentStories, projectAnnotations, getStoryContext} = useContext(DocsContext);

  let stories = componentStories();
  const {stories: {filter} = {filter: undefined}} = projectAnnotations.parameters?.docs || {};
  if (filter) stories = stories.filter(story => filter(story, getStoryContext(story)));

  const hasAutodocsTaggedStory = stories.some(story => story.tags?.includes("autodocs"));
  if (hasAutodocsTaggedStory) stories.filter(story => story?.tags.includes("autodocs") && !story.usesMount);

  if (!includePrimary) stories = stories.slice(1);

  if (!stories || !stories.length) return null;

  return (
    <>
      <Heading>{title}</Heading>
      {stories.map(story => (
        <CodeSnippetBlock of={story.moduleExport}/>
      ))}
    </>
  );
}

export default CustomStories;
