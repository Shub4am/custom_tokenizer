"use client"
import { useState, ChangeEvent } from 'react';
import { Tokenizer } from '../lib/tokenizer/tokenizer';
import { Button } from '@/components/ui/button';
import { TokenizerConfig, TokenizerOutput } from '@/lib/tokenizer/types';
import Link from 'next/link';

const defaultConfig: TokenizerConfig = {
  vocab_size: 1000,
  special_tokens: {
    pad_token: '[PAD]',
    unk_token: '[UNK]',
    bos_token: '[BOS]',
    eos_token: '[EOS]'
  }
};

const getRandomColor = (): string => {
  const colors: string[] = [
    '#FFB6B6', '#FFD6A5', '#FDFFB6', '#CAFFBF',
    '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [encoded, setEncoded] = useState<TokenizerOutput | null>(null);
  const [viewMode, setViewMode] = useState<'tokens' | 'ids'>('tokens');
  const [decodedInput, setDecodedInput] = useState<string>('');
  const [decodedOutput, setDecodedOutput] = useState<string>('');
  const [tokenizer] = useState<Tokenizer>(() => new Tokenizer(defaultConfig));

  const handleEncode = (): void => {
    tokenizer.train([inputText]);
    const result = tokenizer.encode(inputText);
    setEncoded(result);
  };

  const handleDecode = (): void => {
    const ids: number[] = decodedInput
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n));
    const decoded = tokenizer.decode(ids);
    setDecodedOutput(decoded);
  };

  const handleReset = (): void => {
    localStorage.removeItem('tokenizer_vocab');
    window.location.reload();
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputText(e.target.value);
  };

  const handleDecodedInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDecodedInput(e.target.value);
  };

  const clearInput = (): void => {
    setInputText('');
  };

  const setTokenView = (): void => {
    setViewMode('tokens');
  };

  const setIdView = (): void => {
    setViewMode('ids');
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center py-8">
      <div className="w-full mx-auto max-w-6xl flex flex-col gap-6 px-2 py-2">
        <h1 className="text-5xl font-bold text-lime-400 mb-2 text-center">Custom Tokenizer</h1>
        <p className="text-zinc-400 text-center text-lg">
          Learn about language model tokenization
        </p>
        <p className="text-zinc-400 mb-2 text-center text-lg">
          Large language models process text using tokens, which are common sequences of characters found in a set of text. The models learn to understand the statistical relationships between these tokens, and excel at producing the next token in a sequence of tokens.
        </p>



        <div className="shrink-0 bg-lime-700 h-[1px] w-full mb-6"></div>

        {/* Text Input + Token Encoding */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1a] border border-zinc-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-400 mb-2">📝 Token text input</h2>
            <textarea
              className="w-full p-2 bg-[#0d0d0d] border border-zinc-700 rounded text-sm resize-none"
              rows={5}
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter some text"
            />
            <div className="mt-2 flex justify-between items-center text-xs text-zinc-500">
              <span>{inputText.length} characters</span>
              <Button
                className="text-zinc-400 hover:text-red-400"
                onClick={clearInput}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-zinc-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-400 mb-2">📦 Encoding</h2>
            <div className="flex gap-2">
              <Button
                className="px-3 py-1 bg-green-500 rounded text-sm"
                onClick={handleEncode}
              >
                Encode
              </Button>
            </div>
            {encoded && (
              <div className="text-md text-zinc-300 whitespace-pre-wrap my-4">
                IDs: {encoded.ids.join(', ')}
                <br />
                Tokens: {encoded.tokens.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Token Visualization */}
        <div className="bg-[#1a1a1a] border border-zinc-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-400 mb-2">🔍 Token visualization</h2>
          <div className="flex gap-2 mb-4">
            <Button
              className={`px-3 py-1 rounded text-sm ${viewMode === 'tokens' ? 'bg-green-500' : 'bg-zinc-700'}`}
              onClick={setTokenView}
            >
              Text
            </Button>
            <Button
              className={`px-3 py-1 rounded text-sm ${viewMode === 'ids' ? 'bg-green-500' : 'bg-zinc-700'}`}
              onClick={setIdView}
            >
              Token IDs
            </Button>
          </div>

          {encoded ? (
            viewMode === 'tokens' ? (
              <div className="flex flex-wrap gap-2">
                {encoded.tokens.map((token: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-black font-medium"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {token}
                  </span>
                ))}
              </div>
            ) : (
              <div className="bg-[#0d0d0d] border border-zinc-700 rounded p-2 text-sm text-lime-300">
                [{encoded.ids.join(', ')}]
              </div>
            )
          ) : (
            <p className="text-zinc-500">Enter some text for visualization of tokens</p>
          )}
        </div>


        {/* Token Decoding */}
        <div className="bg-[#1a1a1a] border border-zinc-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-400 mb-2">↩️ Decoding</h2>
          <input
            type="text"
            className="w-full p-2 bg-[#0d0d0d] border border-zinc-700 rounded text-sm mb-2"
            value={decodedInput}
            onChange={handleDecodedInputChange}
            placeholder="Enter comma-separated IDs (e.g., 1, 2, 3)"
          />
          <Button
            className="px-3 py-1 bg-green-500 rounded text-sm mb-4"
            onClick={handleDecode}
          >
            Decode
          </Button>
          {decodedOutput && (
            <>
              <div className="bg-[#0d0d0d] border border-zinc-700 rounded p-2 text-sm text-zinc-200">
                {decodedOutput}

              </div>
              <Button
                className="mt-4 px-3 py-1 bg-red-600 rounded text-sm"
                onClick={handleReset}
                variant="destructive"
              >
                Reset
              </Button>
            </>

          )}

          <p className="text-sm text-zinc-500 mt-3">
            Resets the vocabulary and stored tokens
          </p>
        </div>
      </div>
      <footer className="text-lg font-semibold text-center pt-10 text-zinc-400">© 2025
        <Link href={"https://github.com/Shub4am"}
          target="_blank"
          aria-label="github">
          {" "}Shubham
        </Link>
      </footer>
    </main>
  );
}