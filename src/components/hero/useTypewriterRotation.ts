"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_TYPEWRITER_OPTIONS,
  nextTypewriterStep,
  type TypewriterOptions,
} from "@/lib/typewriter";

export function useTypewriterRotation(
  roles: readonly string[],
  options: TypewriterOptions = {},
) {
  const typeSpeed = options.typeSpeed ?? DEFAULT_TYPEWRITER_OPTIONS.typeSpeed;
  const deleteSpeed =
    options.deleteSpeed ?? DEFAULT_TYPEWRITER_OPTIONS.deleteSpeed;
  const pauseAfterType =
    options.pauseAfterType ?? DEFAULT_TYPEWRITER_OPTIONS.pauseAfterType;
  const pauseAfterDelete =
    options.pauseAfterDelete ?? DEFAULT_TYPEWRITER_OPTIONS.pauseAfterDelete;

  const [displayText, setDisplayText] = useState(roles[0] ?? "");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;

    const step = nextTypewriterStep(
      { displayText, roleIndex, isDeleting },
      roles,
      { typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete },
    );

    const timeout = window.setTimeout(() => {
      setDisplayText(step.state.displayText);
      setRoleIndex(step.state.roleIndex);
      setIsDeleting(step.state.isDeleting);
    }, step.delay);

    return () => window.clearTimeout(timeout);
  }, [
    displayText,
    roleIndex,
    isDeleting,
    roles,
    typeSpeed,
    deleteSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return {
    displayText,
    roleIndex,
    isDeleting,
  };
}
