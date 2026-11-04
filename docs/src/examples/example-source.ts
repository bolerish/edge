/** Display only the marked portions of the same module that runs the preview. */
export function exampleSource(source: string, sections: readonly string[]) {
  return sections.map(section => {
    const start = `// docs:start ${section}\n`;
    const end = `// docs:end ${section}`;
    const from = source.indexOf(start);
    const to = source.indexOf(end, from + start.length);
    if (from < 0 || to < 0) throw new Error(`Missing example source section: ${section}`);
    return source.slice(from + start.length, to).trim();
  }).join('\n\n');
}
