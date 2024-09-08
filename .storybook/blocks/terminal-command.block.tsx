// @ts-ignore
import {TerminalCommand} from "@/components/terminal-command";
import {useOf} from "@storybook/blocks";

export function TerminalCommandBlock({of}: {of?: any}) {
  const {story} = useOf(of || 'story', ['story']);

  return (
    <TerminalCommand
      command={`shadcn add ${window.location.origin}/r/${story.componentId}.json`}/>
  )
}