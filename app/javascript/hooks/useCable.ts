import { useEffect } from 'react'
import { createConsumer, ChannelNameWithParams } from '@rails/actioncable'

export const consumer = createConsumer()

function useActionCable<T>(
  channelName: string | ChannelNameWithParams,
  onReceived: (data: T) => void
) {
  useEffect(() => {
    const channel = consumer.subscriptions.create(channelName, {
      received: (data: T) => {
        onReceived(data)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [channelName])
}

export default useActionCable
