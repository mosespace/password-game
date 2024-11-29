'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Defining the password schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(5, 'Your password must be at least 5 characters.')
    .regex(/[0-9]/, 'Your password must include a number.')
    .regex(/[A-Z]/, 'Your password must include an uppercase letter.'),
});

// Defining types for react-hook-form
type FormValues = z.infer<typeof passwordSchema>;

// Defining rules types
interface Rule {
  id: number;
  description: string;
  validator: (value: string) => boolean;
}

export default function page() {
  const [visibleRules, setVisibleRules] = useState<number[]>([]);

  const rules: Rule[] = [
    {
      id: 1,
      description: 'Your password must be at least 5 characters.',
      validator: (value) => value.length >= 5,
    },
    {
      id: 2,
      description: 'Your password must include a number.',
      validator: (value) => /[0-9]/.test(value),
    },
    {
      id: 3,
      description: 'Your password must include an uppercase letter',
      validator: (value) => /[A-Z]/.test(value),
    },
  ];

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const password = watch('password', '');

  // Show first rule when a user immediately starts typying, then show next rules as previous ones are completed.
  useEffect(() => {
    if (password) {
      // if no rules are visible yet and user started typing, show first rule
      if (visibleRules.length === 0) {
        setVisibleRules([1]);
        return;
      }

      // show next rule when current rule is valid
      const lastVisibleRule = visibleRules[visibleRules.length - 1];
      const currentRule = rules.find((rule) => rule.id === lastVisibleRule);

      if (currentRule && currentRule.validator(password)) {
        const nextRuleId = lastVisibleRule + 1; // ie if the last visible rule was 0, i will add a 1 to make it 1
        if (nextRuleId <= rules.length && !visibleRules.includes(nextRuleId)) {
          setVisibleRules((prevRule) => [...prevRule, nextRuleId]);
        }
      }
    } else {
      // reset visible rules when input is empty
      setVisibleRules([]);
    }
    return () => {};
  }, [password, visibleRules]);

  return (
    <div className="min-h-screen text-black bg-[#fffae9] p-8 flex flex-col items-center">
      {/* main-title */}
      <h1 className="text-4xl font-bold items-center flex justify-center mb-12">
        <span className="text-8xl mr-2 mt-8">*</span>
        The Password Game
      </h1>

      <div className="w-full max-w-2xl">
        <p className="text-lg mb-4">Please choose a password</p>

        {/* input-field */}
        <div className="relative mb-8">
          <input
            {...register('password')}
            type="text"
            className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg"
            placeholder="Enter password"
          />

          {/* password-length */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">
            {password.length}
          </span>
        </div>

        {/* password-rules */}
        <div className="space-y-4">
          {rules.map((rule) => {
            if (!visibleRules.includes(rule.id)) return null;

            const isValid = password ? rule.validator(password) : false;
            return (
              <div
                key={rule.id}
                className={`p-4 ${
                  isValid
                    ? 'bg-[#e8f5e9] border-[#c5e8c6]'
                    : 'bg-[#f8afba] border-[#fb818c]'
                } border rounded-lg  transion-colors  duration-300 text-black shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isValid ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check size-5 text-green-600"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x size-5 text-red-600"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  )}

                  <span className="font-medium">Rule {rule.id}</span>
                </div>
                <p>{rule.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
