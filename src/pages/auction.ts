import type { AuctionData } from '../nouns.js';
import { getNounImageUrl } from '../nouns.js';
import { shortenAddress } from '../utils.js';

export function buildAuctionPage(auction: AuctionData, baseUrl: string) {
  const imageUrl = getNounImageUrl(auction.nounId);
  const bidderShort = auction.bidder === '0x0' ? 'None' : shortenAddress(auction.bidder);

  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['image', 'title_item', 'bid_item', 'bidder_item', 'time_item', 'btn_row'],
        },
        image: {
          type: 'image' as const,
          props: { url: imageUrl, aspect: '1:1' as const, alt: `Noun #${auction.nounId}` },
        },
        title_item: {
          type: 'item' as const,
          props: { title: `Noun #${auction.nounId}`, description: 'Current Auction' },
          children: ['live_badge'],
        },
        live_badge: {
          type: 'badge' as const,
          props: { label: auction.settled ? 'Settled' : 'Live', color: auction.settled ? 'gray' as const : 'green' as const },
        },
        bid_item: {
          type: 'item' as const,
          props: { title: 'Current Bid', description: auction.currentBid },
        },
        bidder_item: {
          type: 'item' as const,
          props: { title: 'Top Bidder', description: bidderShort },
        },
        time_item: {
          type: 'item' as const,
          props: { title: 'Time', description: auction.timeRemaining },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['bid_btn', 'share_btn', 'back_btn'],
        },
        bid_btn: {
          type: 'button' as const,
          props: { label: 'Bid on nouns.wtf', variant: 'primary' as const, icon: 'external-link' as const },
          on: {
            press: {
              action: 'open_url' as const,
              params: { target: `https://nouns.wtf/noun/${auction.nounId}` },
            },
          },
        },
        share_btn: {
          type: 'button' as const,
          props: { label: 'Share', icon: 'share' as const },
          on: {
            press: {
              action: 'compose_cast' as const,
              params: {
                text: `Noun #${auction.nounId} is live on auction! ${auction.currentBid} with ${auction.timeRemaining}\n\nBid on nouns.wtf`,
                embeds: [baseUrl],
              },
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
