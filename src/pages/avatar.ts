export function buildAvatarInputPage(baseUrl: string) {
  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['title', 'desc', 'name_input', 'btn_row'],
        },
        title: {
          type: 'text' as const,
          props: { content: 'Noun Avatar Generator', weight: 'bold' as const },
        },
        desc: {
          type: 'text' as const,
          props: { content: 'Type any name to generate a unique Noun avatar. Same name always generates the same Noun.', size: 'sm' as const },
        },
        name_input: {
          type: 'input' as const,
          props: { name: 'avatarName', label: 'Name', placeholder: 'zaal' },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['generate_btn', 'back_btn'],
        },
        generate_btn: {
          type: 'button' as const,
          props: { label: 'Generate', variant: 'primary' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/avatar` },
            },
          },
        },
        back_btn: {
          type: 'button' as const,
          props: { label: 'Back', icon: 'arrow-left' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/` },
            },
          },
        },
      },
    },
  };
}

export function buildAvatarResultPage(name: string, imageUrl: string, baseUrl: string) {
  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['image', 'info', 'btn_row'],
        },
        image: {
          type: 'image' as const,
          props: { url: imageUrl, aspect: '1:1' as const, alt: `Noun for ${name}` },
        },
        info: {
          type: 'item' as const,
          props: { title: `${name}'s Noun`, description: 'Unique avatar generated from name' },
          children: ['avatar_badge'],
        },
        avatar_badge: {
          type: 'badge' as const,
          props: { label: 'Avatar', color: 'purple' as const },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['share_btn', 'another_btn', 'back_btn'],
        },
        share_btn: {
          type: 'button' as const,
          props: { label: 'Share', icon: 'share' as const },
          on: {
            press: {
              action: 'compose_cast' as const,
              params: {
                text: `This is ${name}'s Noun avatar! Generate yours on Nouns Snap by @zaal`,
                embeds: [baseUrl],
              },
            },
          },
        },
        another_btn: {
          type: 'button' as const,
          props: { label: 'Try Another', variant: 'primary' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/avatar-input` },
            },
          },
        },
        back_btn: {
          type: 'button' as const,
          props: { label: 'Home', icon: 'arrow-left' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/` },
            },
          },
        },
      },
    },
  };
}
