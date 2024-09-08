'use client'

import {useState} from 'react'
import {Check, Copy} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Highlight, themes} from "prism-react-renderer"

interface CodeSnippetProps {
  code: string
  language: string
  filename: string
}

const JSIcon = () => (
  <svg fill="none" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.412 14.7143V10.0983H4.548V9.07429H9.516V10.0983H7.652V14.7143H6.412ZM12.599 14.8023C12.1563 14.8023 11.7377 14.7463 11.343 14.6343C10.9537 14.5223 10.6283 14.3703 10.367 14.1783L10.727 13.2023C10.9777 13.3783 11.263 13.517 11.583 13.6183C11.9083 13.7196 12.247 13.7703 12.599 13.7703C12.983 13.7703 13.2577 13.7116 13.423 13.5943C13.5937 13.4716 13.679 13.3196 13.679 13.1383C13.679 12.9836 13.6203 12.861 13.503 12.7703C13.3857 12.6796 13.1803 12.6023 12.887 12.5383L11.983 12.3463C10.975 12.133 10.471 11.6103 10.471 10.7783C10.471 10.421 10.567 10.109 10.759 9.84229C10.951 9.57029 11.2177 9.35963 11.559 9.21029C11.9057 9.06096 12.3057 8.98629 12.759 8.98629C13.1483 8.98629 13.5137 9.04229 13.855 9.15429C14.1963 9.26629 14.479 9.42363 14.703 9.62629L14.343 10.5383C13.9057 10.1916 13.375 10.0183 12.751 10.0183C12.415 10.0183 12.1537 10.085 11.967 10.2183C11.7857 10.3463 11.695 10.5143 11.695 10.7223C11.695 10.877 11.751 11.0023 11.863 11.0983C11.975 11.1943 12.1697 11.2716 12.447 11.3303L13.351 11.5223C14.3857 11.7463 14.903 12.253 14.903 13.0423C14.903 13.3943 14.807 13.7036 14.615 13.9703C14.4283 14.2316 14.1617 14.437 13.815 14.5863C13.4737 14.7303 13.0683 14.8023 12.599 14.8023Z"
      fill="currentColor"></path>
    <rect height="16.8571" rx="1.71429" stroke="currentColor" stroke-width="1.14286" width="16.8571" x="0.571429"
          y="0.571429"></rect>
  </svg>
)

export function CodeSnippet({code, language, filename}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    // noinspection JSIgnoredPromiseFromCall
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <JSIcon/>
          <span className="text-xs text-foreground">{filename}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700"
        >
          {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
        </Button>
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg overflow-x-auto">
        <Highlight code={code.trim()} language={language} theme={themes.github}>
          {({className, style, tokens, getLineProps, getTokenProps}) => (
            <pre className={`${className} text-sm font-mono`} style={{...style, backgroundColor: 'transparent'}}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({line, key: i})}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}