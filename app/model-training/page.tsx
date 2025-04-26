"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, Database, Brain, Play } from "lucide-react"

export default function ModelTrainingPage() {
  const [activeTab, setActiveTab] = useState("data")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const simulateTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 1
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
      <header className="container mx-auto py-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-teal-700 ml-2">Model Training</h1>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Train Your Custom AI Model</CardTitle>
              <CardDescription>
                Customize the AI to better understand physics-based mental health approaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="data">1. Data Preparation</TabsTrigger>
                  <TabsTrigger value="training">2. Training</TabsTrigger>
                  <TabsTrigger value="deployment">3. Deployment</TabsTrigger>
                </TabsList>

                <TabsContent value="data">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Upload Training Data</h3>
                      <p className="text-gray-600 mb-4">
                        Upload text files containing conversations, articles, or research papers related to physics and
                        mental health.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button onClick={simulateUpload} disabled={isUploading}>
                          <Upload className="mr-2 h-4 w-4" /> Upload Files
                        </Button>
                        <Button variant="outline" disabled={isUploading}>
                          <Database className="mr-2 h-4 w-4" /> Use Sample Data
                        </Button>
                      </div>
                      {(isUploading || uploadProgress > 0) && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading data...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Define Custom Prompts</h3>
                      <p className="text-gray-600 mb-4">
                        Create example prompts and responses to guide the model's behavior.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Example Prompt</label>
                          <Textarea
                            placeholder="I'm feeling anxious about my upcoming exam."
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desired Response</label>
                          <Textarea
                            placeholder="I understand your anxiety. From a physics perspective, anxiety is like potential energy - it can be transformed into kinetic energy or work. Let's find ways to channel this energy productively..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <Button variant="outline">Add Example</Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setActiveTab("training")}>Next: Training</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="training">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Training Configuration</h3>
                      <p className="text-gray-600 mb-4">Configure the parameters for your model training.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Base Model</label>
                          <select className="w-full rounded-md border border-gray-300 p-2">
                            <option>GPT-4o</option>
                            <option>GPT-3.5 Turbo</option>
                            <option>Claude 3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Training Epochs</label>
                          <Input type="number" defaultValue={3} min={1} max={10} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Rate</label>
                          <Input type="number" defaultValue={0.0001} step={0.0001} min={0.0001} max={0.01} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
                          <Input type="number" defaultValue={16} min={1} max={64} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Start Training</h3>
                      <p className="text-gray-600 mb-4">
                        Begin the training process. This may take several hours depending on your data size and
                        configuration.
                      </p>
                      <Button onClick={simulateTraining} disabled={isTraining}>
                        <Play className="mr-2 h-4 w-4" /> Start Training
                      </Button>

                      {(isTraining || trainingProgress > 0) && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Training in progress...</span>
                            <span>{trainingProgress}%</span>
                          </div>
                          <Progress value={trainingProgress} className="h-2" />
                          {trainingProgress === 100 && <p className="text-green-600 font-medium">Training complete!</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("data")}>
                        Back: Data Preparation
                      </Button>
                      <Button onClick={() => setActiveTab("deployment")} disabled={trainingProgress < 100}>
                        Next: Deployment
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="deployment">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Model Information</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Model Name</p>
                            <p className="font-medium">Physics-Therapy-Model-v1</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Base Model</p>
                            <p className="font-medium">GPT-4o</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Training Completed</p>
                            <p className="font-medium">April 26, 2025</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Performance Score</p>
                            <p className="font-medium">92.7%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Deploy Your Model</h3>
                      <p className="text-gray-600 mb-4">
                        Deploy your trained model to make it available in your application.
                      </p>
                      <div className="flex gap-4">
                        <Button>
                          <Brain className="mr-2 h-4 w-4" /> Deploy to Production
                        </Button>
                        <Button variant="outline">Test Model</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Integration</h3>
                      <p className="text-gray-600 mb-4">
                        Use this code snippet to integrate your model into your application.
                      </p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('ft:physics-therapy-model-v1'),
  prompt: userMessage,
  system: "You are a therapist with expertise in physics-based mental health approaches."
});`}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("training")}>
                        Back: Training
                      </Button>
                      <Link href="/">
                        <Button>Return to Home</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
