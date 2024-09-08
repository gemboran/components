import {Controls, Description, Primary, Stories, Subtitle, Title, useOf} from "@storybook/blocks";
import {TerminalCommandBlock} from "./terminal-command.block";
import CustomStories from "./custom-stories";

export default function DocTemplate({of}: { of?: any }) {
  const {story} = useOf(of || 'story', ['story']);

  return <div className="doc space-y-4">
    <Title/>
    <Subtitle/>
    <Description/>
    <TerminalCommandBlock/>
    {!story.title.match(/^(lib|hooks)/) ? (
      <>
        <Primary/>
        <Controls/>
        <Stories/>
      </>
    ) : (
      <CustomStories/>
    )}
  </div>
}