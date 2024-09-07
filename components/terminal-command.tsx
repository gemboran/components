"use client"

import {ChevronDown, Copy, Terminal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

type PackageManager = "npm" | "yarn" | "pnpm" | "bun"

interface TerminalCommandProps {
  command: string
  initialPackageManager?: PackageManager
}

export function TerminalCommand({ command, initialPackageManager = "npm" }: TerminalCommandProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>(initialPackageManager)
  const [copied, setCopied] = useState(false)

  const packageManagerCommands: Record<PackageManager, string> = {
    npm: "npx",
    yarn: "yarn dlx",
    pnpm: "pnpm dlx",
    bun: "bunx --bun"
  }

  const copyToClipboard = () => {
    // noinspection JSIgnoredPromiseFromCall
    navigator.clipboard.writeText(`${packageManagerCommands[packageManager]} ${command}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <Terminal className="w-5 h-5 text-gray-500" />
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                {packageManager}
                <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(packageManagerCommands).map((pm) => (
                <DropdownMenuItem key={pm} onSelect={() => setPackageManager(pm as PackageManager)}>
                  {pm}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <pre className="font-mono text-sm">
          <span className="text-green-600">{packageManagerCommands[packageManager]}</span> {command}
        </pre>
      </div>
      {copied && (
        <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
          Copied!
        </div>
      )}
    </div>
  )
}