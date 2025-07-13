"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, Sparkles } from "lucide-react"
import { generateImage } from "./actions"

export default function Component() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词")
      return
    }

    setIsLoading(true)
    setError("")
    setImageUrl("")

    try {
      const result = await generateImage(prompt)
      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl)
      } else {
        setError(result.error || "生成图片失败")
      }
    } catch (err) {
      setError("生成图片时发生错误")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `generated-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI 文生图工具
          </h1>
          <p className="text-gray-600">输入描述，AI 为你生成精美图片</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>图片生成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="请输入图片描述，例如：鱼眼镜头，一只猫咪的头部..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleGenerate()}
                className="flex-1"
              />
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="px-6">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "生成图片"
                )}
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>

        {imageUrl && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>生成结果</CardTitle>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                下载图片
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Generated image"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>提示词：</strong>
                  {prompt}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">AI 正在为你生成图片，请稍候...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
