import { Button, Tab, Tabs, Textarea, useDisclosure } from "@nextui-org/react";
import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import clsx from "clsx";
import { useTransition } from "react";
import Icon from "~/components/Icon";
import useClipboard from "~/hooks/useClipboard";
import useLanguages from "~/hooks/useLanguages";
import LanguageModal from "~/modals/LanguageModal";
import translate from "~/services/translate";

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

  try {
    const text = await translate(content as string, from as string, to as string);

    return json({ success: true, data: text });
  } catch (e) {
    import.meta.env.DEV && console.error(e);
    return json({ success: false, data: e })
  }
};

export default function Index() {
  const languageModalTo = useDisclosure();
  const languageModalFrom = useDisclosure();

  const { from, to, changeLang, historyTo, historyFrom, swapLanguages } = useLanguages();

  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'loading' || transition.state === 'submitting';

  const { copyToClipboard } = useClipboard()

  return (
    <div className="flex h-screen flex-col items-center justify-center">

      <Form method="post" className="p-4 space-y-4 w-full max-w-2xl">
        <input hidden={true} name="to" defaultValue={to} />
        <input hidden={true} name="from" defaultValue={from} />

        <div className="flex gap-2">
          <div className="w-full">
            <div className="flex gap-2 pb-2">
              <Tabs
                aria-label="Translate from language"
                variant="underlined"
                color="primary"
                selectedKey={from}
                onSelectionChange={(k) => changeLang('from', k as string)}
                items={historyFrom}
                classNames={{
                  'tabList': "p-0",
                }}
              >
                {historyFrom.slice(0, 3).map((item) => (
                  <Tab key={item.label} title={item.label} />
                ))}
              </Tabs>

              <Button
                onPress={languageModalFrom.onOpen}
                isIconOnly
                radius="full"
                variant="light"
                aria-label="More"
                className={clsx(languageModalFrom.isOpen && "rotate-180")}
              >
                <Icon name="expand_more" />
              </Button>
            </div>

            <Textarea minRows={6} name="content" height="120px" />

            <LanguageModal
              langLabel={from}
              isOpen={languageModalFrom.isOpen}
              onClose={languageModalFrom.onClose}
              setLang={(lang) => changeLang('from', lang.label)}
            />
          </div>

          <Button
            onPress={swapLanguages}
            isIconOnly
            radius="full"
            variant="light"
            aria-label="More"
            className={clsx([
              languageModalTo.isOpen && "rotate-180",
              "self-center"
            ])}
          >
            <Icon name="swap_horiz" />
          </Button>

          <div className="w-full">
            <div className="flex gap-2 pb-2">
              <Tabs
                aria-label="Translate to language"
                variant="underlined"
                color="primary"
                selectedKey={to}
                onSelectionChange={(k) => changeLang('to', k as string)}
                items={historyTo}
                classNames={{
                  'tabList': "p-0"
                }}
              >
                {historyTo.slice(0, 3).map((item) => (
                  <Tab key={item.label} title={item.label} />
                ))}
              </Tabs>

              <Button
                onPress={languageModalTo.onOpen}
                isIconOnly
                radius="full"
                variant="light"
                aria-label="More"
                className={clsx(languageModalTo.isOpen && "rotate-180")}
              >
                <Icon name="expand_more" />
              </Button>
            </div>

            <div className="relative">
              <Textarea minRows={6} value={actionData?.success && actionData?.data} />

              <Button
                onPress={() => copyToClipboard(actionData?.success && actionData?.data)}
                isIconOnly
                radius="full"
                variant="light"
                aria-label="Copy"
                size="md"
                className={clsx("absolute bottom-1 left-1 text-gray-600", languageModalTo.isOpen && "rotate-180")}
              >
                <Icon className="text-xl" name="content_copy" />
              </Button>
            </div>

            <LanguageModal
              langLabel={to}
              isOpen={languageModalTo.isOpen}
              onClose={languageModalTo.onClose}
              setLang={(lang) => changeLang('to', lang.label)}
            />
          </div>
        </div>

        <Button type="submit" color="primary" aria-label="Translate" disabled={isSubmitting} isLoading={isSubmitting}>
          Translate
        </Button>
      </Form>

      {actionData && actionData.success && <p>Form submitted successfully!</p>}
      {actionData && !actionData.success && <p>Form submitted with error! {JSON.stringify(actionData.data)}</p>}
    </div>
  );
}
