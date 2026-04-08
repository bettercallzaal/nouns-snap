export function buildInputPage(baseUrl: string, totalSupply: number) {
  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['title', 'desc', 'token_input', 'btn_row'],
        },
        title: {
          type: 'text' as const,
          props: { content: 'Show Your Noun', weight: 'bold' as const },
        },
        desc: {
          type: 'text' as const,
          props: { content: `Enter a Noun ID (0-${totalSupply - 1}) to see its image and owner.`, size: 'sm' as const },
        },
        token_input: {
          type: 'input' as const,
          props: { name: 'tokenId', type: 'number' as const, label: 'Noun ID', placeholder: '42' },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['show_btn', 'random_btn'],
        },
        show_btn: {
          type: 'button' as const,
          props: { label: 'Show Noun', variant: 'primary' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/noun` },
            },
          },
        },
        random_btn: {
          type: 'button' as const,
          props: { label: 'Random Noun', icon: 'refresh-cw' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/random` },
            },
          },
        },
      },
    },
  };
}
