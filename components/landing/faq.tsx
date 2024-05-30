import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is YouTube University?</AccordionTrigger>
          <AccordionContent className="text-gray-500">
            YouTube University is a platform where you can learn anything
            through curated YouTube videos.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I get started?</AccordionTrigger>
          <AccordionContent className="text-gray-500">
            Simply sign up and start exploring our curated content and
            bite-sized video lessons.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Is there a cost to use YouTube University?
          </AccordionTrigger>
          <AccordionContent className="text-gray-500">
            No, YouTube University is completely free to use.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
