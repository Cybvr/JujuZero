"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Policy</h1>
        <p className="text-xl text-muted-foreground">Understanding how we use cookies on Juju</p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">What are cookies?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">How we use cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            At Juju, we use cookies to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Remember your login details</li>
            <li>Ensure the security of your account</li>
            <li>Improve the performance of our website</li>
            <li>Analyze how our website is used</li>
            <li>Personalize your experience</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Types of cookies we use</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-muted-foreground">
            <li>
              <strong>Essential cookies:</strong> These are necessary for the website to function properly.
            </li>
            <li>
              <strong>Analytical/performance cookies:</strong> These allow us to recognize and count the number of visitors and see how visitors move around our website when they are using it.
            </li>
            <li>
              <strong>Functionality cookies:</strong> These are used to recognize you when you return to our website.
            </li>
            <li>
              <strong>Targeting cookies:</strong> These record your visit to our website, the pages you have visited and the links you have followed.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Managing cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Most web browsers allow you to manage cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
          </p>
          <p className="text-muted-foreground">
            If you'd like to learn more about cookies and how to manage them, visit <a href="https://www.aboutcookies.org" className="text-primary hover:underline">aboutcookies.org</a>.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Updates to this policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}