import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Tab, Tabs, Textarea } from "@nextui-org/react";
import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { useMemo, useState, useTransition } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Translate" },
    { name: "description", content: "Translator powered by GenAI" },
    { name: "keywords", content: "translate, translator, Artificial Intelligence, AI" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const content = formData.get('content')
  const from = formData.get('from')
  const to = formData.get('to')

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Translate the from ${from} to ${to}: ${content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return json({ success: true, data: text });
  } catch (e) {
    console.error(e);
    return json({ success: false, data: e })
  }
};

export default function Index() {
  const [from, setFrom] = useState<string>("English");
  const [to, setTo] = useState<string>("Spanish");

  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  const isSubmitting = transition.state === 'loading' || transition.state === 'submitting';

  const languages = [
    { id: "en", label: "English" },
    { id: "pt", label: "Portuguese" },
    { id: "sp", label: "Spanish" },
  ];

  return (
    <div className="flex h-screen flex-col items-center justify-center">

      <Form method="post" className="p-4 space-y-4 w-full max-w-2xl">
        <input hidden={true} name="to" defaultValue={to} />
        <input hidden={true} name="from" defaultValue={from} />

        <div className="flex gap-2">
          <div className="w-full">
            <Tabs
              aria-label="Translate from language"
              variant="underlined"
              color="primary"
              selectedKey={from}
              onSelectionChange={setFrom}
              items={languages}
            >
              {(item) => (
                <Tab key={item.id} title={item.label} />
              )}
            </Tabs>

            <Textarea name="content" height="120px" />
          </div>

          <div className="w-full">
            <Tabs
              aria-label="Translate from language"
              variant="underlined"
              color="primary"
              selectedKey={to}
              onSelectionChange={setTo}
              items={languages}
            >
              {(item) => (
                <Tab key={item.id} title={item.label} />
              )}
            </Tabs>

            <Textarea value={actionData?.success && actionData?.data} />
          </div>

        </div>

        <Button type="submit" color="primary" aria-label="Translate" disabled={isSubmitting} isLoading={isSubmitting}>
          Translate
        </Button>
      </Form>

      {actionData && actionData.success && <p>Form submitted successfully!</p>}
      {actionData && actionData.error && <p>Form submitted with error! {JSON.stringify(actionData.data)}</p>}
    </div>
  );
}
