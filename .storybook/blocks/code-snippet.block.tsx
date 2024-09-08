// @ts-ignore
import {CodeSnippet} from "@/components/code-snippet";
import {useOf} from "@storybook/blocks";

export function CodeSnippetBlock({of}: { of: any }) {
  const {story} = useOf(of || 'story', ['story']);

  return (
    <CodeSnippet
      filename={story.name}
      language={story.initialArgs.language || "ts"}
      code={story.initialArgs.code}
    />
  )
}