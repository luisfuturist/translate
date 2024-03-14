import { Button, Card, CardBody, Radio, RadioGroup } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Translate" },
    { name: "description", content: "Translator powered by GenAI" },
    { name: "keywords", content: "translate, translator, Artificial Intelligence, AI" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix (with Vite and Cloudflare)</h1>

      <h1 className="text-3xl text-red-500 font-bold underline">
        Hello world!
      </h1>

      <Button color="primary">
        Throw error
      </Button>
    </div>
  );
}
