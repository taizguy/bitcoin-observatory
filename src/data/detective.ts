import { DetectiveCase } from '../types';

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'case-1',
    title: 'The Great Ice Age Floor',
    difficulty: 'Novice',
    mysteryPrompt: 'An enigmatic period where the media declared Bitcoin obsolete. The price has fallen for over a year. Examine the on-chain footprints to diagnose the cycle phase.',
    clues: [
      {
        label: 'MVRV Ratio',
        dataPoint: '0.69',
        significance: 'Market price is trading at a ~31% discount to the aggregate acquisition cost of all active coins.'
      },
      {
        label: 'NUPL (Unrealized Profit/Loss)',
        dataPoint: '-0.45',
        significance: 'Deep in the negative zone. The entire network is bleeding on paper.'
      },
      {
        label: 'SOPR (Spent Output Profit Ratio)',
        dataPoint: '0.82',
        significance: 'Coins moving on-chain are being sold at an average 18% realized loss.'
      },
      {
        label: 'Long-Term Holder Supply',
        dataPoint: '71.0%',
        significance: 'Despite widespread panic, strong hands are quietly soaking up coins.'
      }
    ],
    chartSnippet: [
      { label: 'T-90d', value: 0.95 },
      { label: 'T-60d', value: 0.85 },
      { label: 'T-30d', value: 0.76 },
      { label: 'Event', value: 0.69 },
      { label: 'T+30d', value: 0.74 }
    ],
    options: [
      {
        id: 'capitulation',
        stage: 'Capitulation',
        description: 'Exhaustion phase where desperate sellers dump at heavy losses, marking generational macro bottoms.'
      },
      {
        id: 'euphoria',
        stage: 'Euphoria',
        description: 'Parabolic retail frenzy where everybody is in massive profit.'
      },
      {
        id: 'distribution',
        stage: 'Distribution',
        description: 'Smart money exiting their positions near cycle highs.'
      },
      {
        id: 'expansion',
        stage: 'Expansion',
        description: 'Strong bull trend breaking previous record highs with high volume.'
      }
    ],
    correctOptionId: 'capitulation',
    revealDate: 'December 2018',
    revealPrice: '$3,200',
    explanation: 'This was the legendary December 2018 capitulation floor! MVRV hit 0.69 and NUPL was -0.45. While casual observers were panicked, on-chain metrics screamed that coins were trading far below production and historical cost bases—the hallmark of terminal Capitulation.',
    lessonTaught: 'When MVRV drops below 1.0 and SOPR drops below 0.85, the market is enduring forced capitulation. Historically, these rare windows have represented generational accumulation zones.',
    xpReward: 150
  },
  {
    id: 'case-2',
    title: 'The Unprecedented Mania',
    difficulty: 'Investigator',
    mysteryPrompt: 'Celebrities, cocktail party guests, and mainstream television are talking non-stop about crypto. The network is buzzing with record traffic. What is happening under the hood?',
    clues: [
      {
        label: 'MVRV Ratio',
        dataPoint: '4.82',
        significance: 'Market price is trading at nearly 5 times the aggregate cost basis of existing holders.'
      },
      {
        label: 'NUPL',
        dataPoint: '0.79',
        significance: 'Extreme greed zone. Almost 80% of total market capitalization represents pure unrealized paper gain.'
      },
      {
        label: 'Long-Term Holder Supply',
        dataPoint: '61.5% (Plummeting)',
        significance: 'Experienced early holders are offloading millions of coins to newly registered retail accounts.'
      },
      {
        label: 'Transaction Fees',
        dataPoint: '$35+ median fee',
        significance: 'Mempools are severely jammed with unconfirmed retail transactions.'
      }
    ],
    chartSnippet: [
      { label: 'T-90d', value: 2.4 },
      { label: 'T-60d', value: 3.1 },
      { label: 'T-30d', value: 4.1 },
      { label: 'Event', value: 4.82 },
      { label: 'T+30d', value: 3.6 }
    ],
    options: [
      {
        id: 'accumulation',
        stage: 'Accumulation',
        description: 'Quiet buying while market remains boring and sideways.'
      },
      {
        id: 'capitulation',
        stage: 'Capitulation',
        description: 'Insolvent liquidation cascade creating forced sales.'
      },
      {
        id: 'euphoria',
        stage: 'Euphoria',
        description: 'Parabolic mania where valuation explodes far beyond underlying realized capital.'
      },
      {
        id: 'reaccumulation',
        stage: 'Reaccumulation',
        description: 'Mid-cycle base forming after a healthy pullback.'
      }
    ],
    correctOptionId: 'euphoria',
    revealDate: 'December 2017',
    revealPrice: '$19,600',
    explanation: 'This was the climax of the 2017 bull run! MVRV reached 4.82 as retail investors rushed in, completely unaware that long-term holders were actively dumping their supply into the liquidity flood.',
    lessonTaught: 'When MVRV exceeds 3.7 and LTH supply plunges rapidly, the market has transitioned into Euphoria. On-chain analysis reveals who is selling to whom.',
    xpReward: 200
  },
  {
    id: 'case-3',
    title: 'The Silent Absorption',
    difficulty: 'Investigator',
    mysteryPrompt: 'Price has traded in a tight, frustrating corridor for 6 months. Volume is low, social media mentions have plummeted, and sentiment is completely neutral.',
    clues: [
      {
        label: 'MVRV Ratio',
        dataPoint: '1.18',
        significance: 'Hovering just above 1.0; sellers are no longer dumping at deep discounts.'
      },
      {
        label: 'Exchange Balances',
        dataPoint: '-3,200 BTC/day net',
        significance: 'Coins are continually vanishing from Binance, Coinbase, and Kraken into cold wallets.'
      },
      {
        label: 'Long-Term Holder Supply',
        dataPoint: '75.4% (New High)',
        significance: 'Over three-quarters of supply is strictly held by entities that do not trade short term.'
      },
      {
        label: 'Hashrate',
        dataPoint: 'Rebounding +18%',
        significance: 'Miners are deploying fresh capital and energizing new state-of-the-art facilities.'
      }
    ],
    chartSnippet: [
      { label: 'T-90d', value: 1.05 },
      { label: 'T-60d', value: 1.10 },
      { label: 'T-30d', value: 1.14 },
      { label: 'Event', value: 1.18 },
      { label: 'T+30d', value: 1.29 }
    ],
    options: [
      {
        id: 'accumulation',
        stage: 'Accumulation / Reaccumulation',
        description: 'Patient structural absorption of liquid supply before the next expansion phase.'
      },
      {
        id: 'distribution',
        stage: 'Distribution',
        description: 'Whales selling off their holdings to retail.'
      },
      {
        id: 'euphoria',
        stage: 'Euphoria',
        description: 'Wild parabolic mania.'
      },
      {
        id: 'downtrend',
        stage: 'Downtrend',
        description: 'Severe bear market with accelerating loss realization.'
      }
    ],
    correctOptionId: 'accumulation',
    revealDate: 'July 2023',
    revealPrice: '$29,500',
    explanation: 'Correct! This was the mid-2023 Reaccumulation zone prior to the Bitcoin ETF approvals. While prices stayed boring around $29,000, on-chain data revealed massive supply drying up into cold storage and long-term holder hands.',
    lessonTaught: 'Boring price action accompanied by rising LTH supply and falling exchange balances is classic Accumulation. The price does not reflect the supply squeeze until floating liquidity is fully exhausted.',
    xpReward: 250
  },
  {
    id: 'case-4',
    title: 'The Liquidity Trap Exit',
    difficulty: 'Master Sleuth',
    mysteryPrompt: 'Price hit a new high a few months ago, but the latest rally failed to break the previous peak. Look closely at who is spending and the health of network participants.',
    clues: [
      {
        label: 'SOPR (Spent Output Profit Ratio)',
        dataPoint: '1.09 spiked, now breaking below 1.00',
        significance: 'Profit-taking peaked and sellers are now scrambling to exit even at breakeven.'
      },
      {
        label: 'Exchange Inflow Volume',
        dataPoint: '+18,500 BTC spike',
        significance: 'Unusually large deposits hitting centralized exchanges.'
      },
      {
        label: 'Short-Term Holder Supply in Profit',
        dataPoint: 'Plummeted from 88% to 24%',
        significance: 'Recent buyers are suddenly trapped underwater.'
      },
      {
        label: 'Active Addresses',
        dataPoint: 'Diverging downward (-18%)',
        significance: 'User growth is stalling while prices remain elevated.'
      }
    ],
    chartSnippet: [
      { label: 'T-90d', value: 2.8 },
      { label: 'T-60d', value: 2.6 },
      { label: 'T-30d', value: 2.3 },
      { label: 'Event', value: 1.95 },
      { label: 'T+30d', value: 1.6 }
    ],
    options: [
      {
        id: 'distribution',
        stage: 'Distribution',
        description: 'Smart money offloading into late buyers, setting up a structural rollover.'
      },
      {
        id: 'accumulation',
        stage: 'Accumulation',
        description: 'Quiet wealth transfer into diamond hands.'
      },
      {
        id: 'expansion',
        stage: 'Expansion',
        description: 'Fresh institutional capital fueling a breakout.'
      },
      {
        id: 'capitulation',
        stage: 'Capitulation',
        description: 'Bottom of the bear market.'
      }
    ],
    correctOptionId: 'distribution',
    revealDate: 'November 2021',
    revealPrice: '$65,000 -> $58,000',
    explanation: 'Masterful work! This was the late 2021 Distribution phase. Although the price hit $69,000, on-chain indicators exhibited bearish divergences: exchange inflows surged, active addresses dropped, and SOPR collapsed through 1.0.',
    lessonTaught: 'When prices make equal or higher highs but on-chain activity and holder profitability diverge downward, you are observing Distribution. The smart money is using exit liquidity.',
    xpReward: 300
  }
];
