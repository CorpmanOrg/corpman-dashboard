"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function StatModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function useStatModal(initial?: {
  title?: string;
  description?: string;
  content?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState<ReactNode>(initial?.content ?? null);

  const openWith = (args: {
    title: string;
    content: ReactNode;
    description?: string;
  }) => {
    setTitle(args.title);
    setContent(args.content);
    setDescription(args.description ?? "");
    setOpen(true);
  };

  return {
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    content,
    setContent,
    openWith,
  };
}
