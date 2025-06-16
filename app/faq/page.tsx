import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { Layout } from '@/components/layout'

import { FAQ } from '@/lib/config'

import { MessageCircleQuestion } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function Faq() {
  return (
    <Layout>
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <MessageCircleQuestion className="h-10 w-10" /> FAQ
        </h1>
        <p className="superfier-subtitle">Find answers to your questions here.</p>
        <section>
          {FAQ.map((item, index) => (
            <Accordion type="single" collapsible className="w-full" key={index}>
              <AccordionItem value={`item-${index}`} className="w-full border-b-0">
                <AccordionTrigger className="w-full justify-between py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground prose prose-sm dark:prose-invert w-full">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </section>
      </main>
    </Layout>
  )
}
