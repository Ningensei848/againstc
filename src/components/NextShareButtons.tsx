import React, { useEffect, useState } from 'react'

// cf. https://github.com/Bunlong/next-share
import {
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
  FacebookShareButton,
  FacebookIcon,
  WeiboShareButton,
  WeiboIcon,
  PocketShareButton,
  PocketIcon,
  HatenaShareButton,
  HatenaIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon
} from 'next-share'

import styles from '@site/src/css/NextShareButtons.module.css'
import { useDebounce } from '@site/src/libs/debounce'

interface CommonProps {
  url: string
  title: string
}

interface NextShareButtonProps {
  href?: string
  title?: string
}

interface SocialButtonsProps extends NextShareButtonProps {
  onHover: () => void
}

const HashTag = 'againstc'

const IconProps = {
  size: 32,
  round: true
}

const Facebook = (props: CommonProps): JSX.Element => (
  <FacebookShareButton {...props} quote={props.title} hashtag={HashTag}>
    <FacebookIcon {...IconProps} />
  </FacebookShareButton>
)

const Twitter = (props: CommonProps): JSX.Element => (
  <TwitterShareButton {...props} hashtags={[HashTag]} related={['Cristoforou', 'ganrim_']}>
    <TwitterIcon {...IconProps} />
  </TwitterShareButton>
)

const Line = (props: CommonProps): JSX.Element => (
  <LineShareButton {...props}>
    <LineIcon {...IconProps} />
  </LineShareButton>
)

const Weibo = (props: CommonProps): JSX.Element => (
  <WeiboShareButton {...props}>
    <WeiboIcon {...IconProps} />
  </WeiboShareButton>
)

const Pocket = (props: CommonProps): JSX.Element => (
  <PocketShareButton {...props}>
    <PocketIcon {...IconProps} />
  </PocketShareButton>
)

const Hatena = (props: CommonProps): JSX.Element => (
  <HatenaShareButton {...props}>
    <HatenaIcon {...IconProps} />
  </HatenaShareButton>
)

const Reddit = (props: CommonProps): JSX.Element => (
  <RedditShareButton {...props}>
    <RedditIcon {...IconProps} />
  </RedditShareButton>
)

const Telegram = (props: CommonProps): JSX.Element => (
  <TelegramShareButton {...props}>
    <TelegramIcon {...IconProps} />
  </TelegramShareButton>
)

const SocialButtons = React.memo(({ href, title, onHover: handleEvent }: SocialButtonsProps) => {
  const common = { url: href, title }

  return (
    <div className={styles.SocialButtons} onMouseOver={handleEvent} onTouchStart={handleEvent}>
      <Facebook {...common} />
      <Twitter {...common} />
      <Line {...common} />
      <Weibo {...common} />
      <Pocket {...common} />
      <Hatena {...common} />
      <Reddit {...common} />
      <Telegram {...common} />
    </div>
  )
})

const NextShareButtons = ({ href = '', title = '' }: NextShareButtonProps): JSX.Element => {
  const [url, setUrl] = useState(href)
  const [subject, setSubject] = useState(title)
  const debounce = useDebounce(200)
  const handleEvent = () =>
    debounce(() => {
      const { origin, pathname, search } = window.location
      const newUrl = [origin, pathname, search].join('')
      if (newUrl !== url) {
        setUrl(newUrl)
      }
    })

  useEffect(() => {
    // title が指定されていないとき， document からページタイトルを持ってくる
    if (document && !title.length) {
      setSubject(document.title)
    }
  }, [url])

  return <SocialButtons href={url} title={subject} onHover={handleEvent} />
}

export default NextShareButtons
