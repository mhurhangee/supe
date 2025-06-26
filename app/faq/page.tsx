import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { FAQ } from '@/lib/config'

import { MessageCircleQuestion } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function Faq() {
  const defaultValues = FAQ.map((_, index) => `item-${index}`)

  return (
      <main className="superfier-container container">
        <h1 className="superfier-title">
          <MessageCircleQuestion className="h-10 w-10" /> FAQ
        </h1>
        <p className="superfier-subtitle">Find answers to your questions here.</p>
        <section>
          <Accordion type="multiple" className="w-full" defaultValue={defaultValues}>
            {FAQ.map((item, index) => (
              <AccordionItem value={`item-${index}`} className="w-full border-b-0" key={index}>
                <AccordionTrigger className="w-full justify-between py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground prose prose-sm dark:prose-invert w-full">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
  )
}
