'use client';

import * as React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DefinitionToggleProps = {
  question: string;
  answer: string;
};

function DefinitionToggle({ question, answer }: DefinitionToggleProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer text-xs font-medium text-zinc-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        aria-expanded={open}
      >
        {question}
      </button>
      {open ? (
        <div className="rounded-2xl border border-zinc-200/70 bg-white/90 p-4 text-sm leading-relaxed text-zinc-600 shadow-sm dark:border-zinc-700/70 dark:bg-zinc-900/80 dark:text-zinc-300">
          {answer}
        </div>
      ) : null}
    </div>
  );
}

const validatorStats = [
  {
    network: "Ethereum",
    logo: "/ethereum.svg",
    primary: {
      count: "≈11,700",
      label: "Estimated beacon and propagation nodes",
      definition: {
        question: "What is a Beacon node?",
        answer:
          "Beacon nodes track the consensus state, gossip new blocks, and serve validator clients. Operators often run a few hardened nodes that back thousands of validator keys.",
      },
    },
    secondary: {
      count: "1,025,390",
      label: "Active validator keys",
      definition: {
        question: "What is a Validator Key?",
        answer:
          "Each 32 ETH deposit registers a BLS validator key used to propose and attest blocks. Keys can be batched by a single operator, so the key count can be far higher than the number of independent machines.",
      },
    },
    nuance:
      "Large staking pools and professional operators batch many validator keys on a small fleet of hardened nodes.",
  },
  {
    network: "Solana",
    logo: "/solana.svg",
    primary: {
      count: "≈3,815",
      label: "Active voting validators",
      definition: {
        question: "What is a Voting Validator?",
        answer:
          "A voting validator is a Solana node participating in consensus by casting votes on blocks. Each voting validator runs on dedicated hardware with strict performance requirements.",
      },
    },
    secondary: {
      count: "3,815",
      label: "Voting accounts",
      definition: {
        question: "What is a Voting Account?",
        answer:
          "Voting accounts hold the stake authority for a validator and record its votes on-chain. Because each validator needs its own high-throughput machine, the voting account count tracks the active node count one-to-one.",
      },
    },
    nuance:
      "Hardware and uptime requirements are high, but each key reflects a distinct operator-managed validator.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-16 font-sans text-zinc-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-50">
      <main className="w-full max-w-4xl space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Validator nodes and the keys they host
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Headline counts show validator nodes online, with validator keys as
            supporting context. Data is currently hard-coded while the live feed
            is under development.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {validatorStats.map((stat) => (
            <Card key={stat.network}>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-3">
                  <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <Image
                      src={stat.logo}
                      alt={`${stat.network} logo`}
                      width={24}
                      height={24}
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <span className="normal-case">{stat.network}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 px-8 py-10 md:py-12">
                <div className="space-y-2">
                  <span className="text-5xl font-semibold tracking-tight sm:text-6xl">
                    {stat.primary.count}
                  </span>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {stat.primary.label}
                  </p>
                  <DefinitionToggle
                    question={stat.primary.definition.question}
                    answer={stat.primary.definition.answer}
                  />
                </div>

                <div className="rounded-2xl border border-zinc-200/60 bg-white/80 px-4 py-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                      {stat.secondary.label}
                    </span>
                    <span className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                      {stat.secondary.count}
                    </span>
                  </div>
                  <div className="mt-3">
                    <DefinitionToggle
                      question={stat.secondary.definition.question}
                      answer={stat.secondary.definition.answer}
                    />
                  </div>
                </div>

                
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="rounded-2xl bg-amber-50/80 px-4 py-4 text-sm text-amber-900 transition-colors dark:bg-amber-400/10 dark:text-amber-100">
            Validator keys are logical identities, not machines. On Ethereum,
            every 32 ETH deposit registers a new validator; you can repeat 32
            ETH deposits and run many validator keys on the same beacon node,
            so “validator” counts can overstate unique hardware. On Solana,
            each voting validator maps to a single high‑performance machine, so
            node counts are a closer proxy for distinct physical validators. We
            therefore lead with node counts and show keys as supporting context.
          </div>
        </section>

        <section>
          <Card className="border-dashed border-zinc-200/70 bg-white/80 dark:border-zinc-800/70 dark:bg-zinc-950/60">
              <CardHeader className="space-y-3">
              <CardTitle className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
                Why these numbers still don't tell the full story
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-10 text-sm text-zinc-600 dark:text-zinc-300">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span>
                    Validator counts tell us how much stake is active in consensus. They do not tell us how many independent operators are running that stake.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span>
                    On Ethereum, one operator can run several beacon nodes, and each beacon node can manage thousands of validator keys. The numbers we see on-chain reflect activity, not independence.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span>
                    On Solana, each validator must run on dedicated, high-performance hardware. The validator count therefore tracks the number of machines more closely, but a single entity can still operate multiple validators across regions or data centers.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span>
                    Finding out how many unique entities actually control these validators is an ongoing area of research. It requires linking on-chain data with off-chain clues about operators, hosting infrastructure, and stake delegation patterns.
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
                Sources to be linked once live data feeds are connected.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
