// @ts-ignore
import {TerminalCommand} from "@/components/terminal-command";
import {useOf} from "@storybook/blocks";

export function TerminalCommandBlock({of}: {of?: any}) {
  const resolvedOf = useOf(of || 'story', ['story', 'meta']);

  if (resolvedOf.type !== 'story') return;

  return (
    <TerminalCommand command={`shadcn add ${window.location.hostname}/r/styles/default/${resolvedOf.story.title}.json`} />
  )
}