import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import clsx from "clsx";
import Icon from "~/components/Icon";
import { SUPPORTED_LANGUAGES } from "~/data";
import { Lang } from "~/types";

interface Props {
  isOpen: boolean
  onClose: () => void
  lang: string;
  setLang?: (lang: Lang) => void
}

export default function LanguageModal(props: Props) {
  return (
    <Modal
      scrollBehavior="inside"
      size="3xl"
      isOpen={props.isOpen}
      onClose={props.onClose}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <ul className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <li key={lang.label} className="flex justify-start">
                    <Button
                      variant="light"
                      onClick={(() => {
                        props.setLang?.(lang)
                        onClose()
                      })}
                      className={clsx([
                        "flex w-full justify-start",
                        lang.id === props.lang && "text-primary"
                      ])}
                      aria-current={lang.id === props.lang}
                    >
                      <Icon
                        className={clsx([
                          lang.id !== props.lang && 'opacity-0'
                        ])}
                        aria-hidden
                      >
                        check
                      </Icon>
                      {lang.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}