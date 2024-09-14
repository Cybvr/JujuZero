import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Twitter, Linkedin, Github } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About Juju</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Vision</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Juju is at the forefront of revolutionizing file management and editing. We envision a world where managing digital assets is effortless, intuitive, and powerful. Our platform is designed to simplify complex tasks, allowing users to focus on creativity and productivity.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our mission is to provide an all-in-one solution that empowers users to convert, edit, and manage their files seamlessly. We strive to enhance productivity and streamline workflows by offering cutting-edge tools that are accessible to everyone, from individual creators to large enterprises.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Behind Juju is a diverse team of passionate professionals, each bringing unique expertise to the table:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Software engineers with a knack for creating robust, scalable solutions</li>
            <li>AI specialists pushing the boundaries of machine learning in file processing</li>
            <li>UX designers committed to crafting intuitive, user-friendly interfaces</li>
            <li>Customer support experts ensuring a smooth experience for all users</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We value our user community and are always eager to hear your thoughts, suggestions, or concerns. Reach out to us through any of the following channels:
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>art@visual.ng</span>
            </div>
            <div className="flex items-center space-x-2">
              <Twitter className="h-5 w-5" />
              <span>@Juju</span>
            </div>
            <div className="flex items-center space-x-2">
              <Linkedin className="h-5 w-5" />
              <span>Juju</span>
            </div>
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5" />
              <span>github.com/Jujuzero</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}