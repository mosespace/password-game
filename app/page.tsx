'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z
    .string()
    .min(5, 'Your password must be at least 5 characters.')
    .regex(/[0-9]/, 'Your password must include a number.')
    .regex(/[A-Z]/, 'Your password must include an uppercase letter.')
    .regex(/[!@#$%^&*()]/, 'Your password must include a special character.')
    .regex(
      /^(?!.*(.)\1{2})/,
      'Your password cannot have 3 consecutive repeated characters',
    ),
});

type FormValues = z.infer<typeof passwordSchema>;

interface Rule {
  id: number;
  description: string;
  validator: (value: string) => boolean;
}

export default function PasswordGamePage() {
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
    {
      id: 4,
      description:
        'Your password must include a special character (!@#$%^&*())',
      validator: (value) => /[!@#$%^&*()]/.test(value),
    },
    {
      id: 5,
      description:
        'Your password cannot have 3 consecutive repeated characters',
      validator: (value) => !/(.)\1{2}/.test(value),
    },
    {
      id: 6,
      description:
        'Your password must contain a palindrome word (min 3 letters)',
      validator: (value) => {
        const words = value.split(/\s+/);
        return words.some((word) => {
          const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
          return (
            cleaned.length >= 3 &&
            cleaned === cleaned.split('').reverse().join('')
          );
        });
      },
    },
    {
      id: 7,
      description: 'Your password must include a year between 1900 and 2024',
      validator: (value) => /\b(19\d{2}|20[0-2]\d)\b/.test(value),
    },
    {
      id: 8,
      description:
        'Your password must include lyrics that form a complete rhyming couplet',
      validator: (value) => {
        const couplets = [
          /\b(love|dove)\b.*\b(above|move)\b/i,
          /\b(heart|smart)\b.*\b(art|part)\b/i,
          /\b(light|bright)\b.*\b(height|might)\b/i,
        ];
        return couplets.some((couplet) => couplet.test(value));
      },
    },
    {
      id: 9,
      description:
        'Your password must contain a mathematical equation that resolves to an integer',
      validator: (value) => {
        try {
          const matches = value.match(/(\d+)\s*([+\-*/])\s*(\d+)\s*=\s*(\d+)/);
          if (!matches) return false;

          const [, a, op, b, result] = matches;
          switch (op) {
            case '+':
              return parseInt(a) + parseInt(b) === parseInt(result);
            case '-':
              return parseInt(a) - parseInt(b) === parseInt(result);
            case '*':
              return parseInt(a) * parseInt(b) === parseInt(result);
            case '/':
              return parseInt(a) / parseInt(b) === parseInt(result);
            default:
              return false;
          }
        } catch {
          return false;
        }
      },
    },
    {
      id: 10,
      description:
        'Your password must reference a famous historical figure and their significant achievement',
      validator: (value) => {
        const historicalReferences = [
          /einstein.*relativity/i,
          /newton.*gravity/i,
          /marie\s*curie.*radioactivity/i,
          /tesla.*electricity/i,
        ];
        return historicalReferences.some((ref) => ref.test(value));
      },
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

  const updateVisibleRules = useCallback(() => {
    if (!password) {
      setVisibleRules([]);
      return;
    }

    setVisibleRules((prevVisibleRules) => {
      // If no rules are visible, show the first rule
      if (prevVisibleRules.length === 0) {
        return [1];
      }

      // Find the last visible rule
      const lastVisibleRule = prevVisibleRules[prevVisibleRules.length - 1];
      const currentRule = rules.find((rule) => rule.id === lastVisibleRule);

      // If current rule is valid, show next rule
      if (currentRule && currentRule.validator(password)) {
        const nextRuleId = lastVisibleRule + 1;
        if (
          nextRuleId <= rules.length &&
          !prevVisibleRules.includes(nextRuleId)
        ) {
          return [...prevVisibleRules, nextRuleId];
        }
      }

      return prevVisibleRules;
    });
  }, [password, rules]);

  useEffect(() => {
    updateVisibleRules();
  }, [updateVisibleRules]);

  // Render method remains the same as in previous version
  return (
    <div className="min-h-screen text-black bg-[#fffae9] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold items-center flex justify-center mb-12">
        <span className="text-8xl mr-2 mt-8">*</span>
        The Password Game
      </h1>

      <div className="w-full max-w-2xl">
        <p className="text-lg mb-4">Please choose a password</p>

        <div className="relative mb-8">
          <input
            {...register('password')}
            type="text"
            className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg"
            placeholder="Enter password"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">
            {password.length}
          </span>
        </div>

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
