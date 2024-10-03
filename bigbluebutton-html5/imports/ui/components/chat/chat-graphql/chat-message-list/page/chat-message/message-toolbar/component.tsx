import React from 'react';
import { useMutation } from '@apollo/client';
import Popover from '@mui/material/Popover';
import { layoutSelect } from '/imports/ui/components/layout/context';
import Button from '/imports/ui/components/common/button/component';
import BBBMenu from '/imports/ui/components/common/menu/component';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { ChatEvents } from '/imports/ui/core/enums/chat';
import { defineMessages, useIntl } from 'react-intl';
import {
  Container,
  EmojiPicker,
  EmojiPickerWrapper,
  EmojiButton,
} from './styles';
import { colorDanger, colorWhite } from '/imports/ui/stylesheets/styled-components/palette';
import { CHAT_DELETE_MESSAGE_MUTATION } from '../mutations';

const intlMessages = defineMessages({
  reply: {
    id: 'app.chat.toolbar.reply',
    description: 'reply label',
  },
  edit: {
    id: 'app.chat.toolbar.edit',
    description: 'edit label',
  },
  delete: {
    id: 'app.chat.toolbar.delete',
    description: 'delete label',
  },
});

interface ChatMessageToolbarProps {
  messageId: string;
  chatId: string;
  username: string;
  message: string;
  messageSequence: number;
  emphasizedMessage: boolean;
  onEmojiSelected(emoji: { id: string; native: string }): void;
  onEditRequest(): void;
}

const ChatMessageToolbar: React.FC<ChatMessageToolbarProps> = (props) => {
  const {
    messageId, chatId, message, username, onEmojiSelected, messageSequence, emphasizedMessage, onEditRequest,
  } = props;
  const [reactionsAnchor, setReactionsAnchor] = React.useState<Element | null>(
    null,
  );
  const intl = useIntl();
  const [chatDeleteMessage] = useMutation(CHAT_DELETE_MESSAGE_MUTATION);

  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const CHAT_TOOLBAR_CONFIG = window.meetingClientSettings.public.chat.toolbar;
  const CHAT_REPLIES_ENABLED = CHAT_TOOLBAR_CONFIG.includes('reply');
  const CHAT_REACTIONS_ENABLED = CHAT_TOOLBAR_CONFIG.includes('reactions');
  const CHAT_EDIT_ENABLED = CHAT_TOOLBAR_CONFIG.includes('edit');
  const CHAT_DELETE_ENABLED = CHAT_TOOLBAR_CONFIG.includes('delete');
  const actions = [];

  if (CHAT_EDIT_ENABLED) {
    actions.push({
      key: 'edit',
      icon: 'pen_tool',
      label: intl.formatMessage(intlMessages.edit),
      onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onEditRequest();
        window.dispatchEvent(
          new CustomEvent(ChatEvents.CHAT_EDIT_REQUEST, {
            detail: {
              messageId,
              chatId,
            },
          }),
        );
      },
    });
  }

  if (CHAT_DELETE_ENABLED) {
    const customStyles = { background: colorDanger, color: colorWhite };
    actions.push({
      key: 'delete',
      icon: 'delete',
      label: intl.formatMessage(intlMessages.delete),
      customStyles,
      onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();

        chatDeleteMessage({
          variables: {
            chatId,
            messageId,
          },
        });
      },
    });
  }

  if (!CHAT_TOOLBAR_CONFIG.length) return null;

  return (
    <Container className="chat-message-toolbar" $sequence={messageSequence}>
      {CHAT_REPLIES_ENABLED && (
        <>
          <Button
            circle
            ghost
            aria-describedby={`chat-reply-btn-label-${messageSequence}`}
            icon="undo"
            color="light"
            size="sm"
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              window.dispatchEvent(
                new CustomEvent(ChatEvents.CHAT_REPLY_INTENTION, {
                  detail: {
                    username,
                    message,
                    messageId,
                    chatId,
                    emphasizedMessage,
                    sequence: messageSequence,
                  },
                }),
              );
            }}
          />
          <span id={`chat-reply-btn-label-${messageSequence}`} className="sr-only">
            {intl.formatMessage(intlMessages.reply, { 0: messageSequence })}
          </span>
        </>
      )}
      {CHAT_REACTIONS_ENABLED && (
        <EmojiButton
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            setReactionsAnchor(e.currentTarget);
          }}
          size="sm"
          icon="happy"
          color="light"
          ghost
          type="button"
          circle
          data-test="emojiPickerButton"
        />
      )}

      {actions.length > 0 && (
        <BBBMenu
          trigger={(
            <Button
              onClick={() => null}
              size="sm"
              icon="more"
              color="light"
              ghost
              type="button"
              circle
            />
          )}
          actions={actions}
          opts={{
            id: 'app-settings-dropdown-menu',
            keepMounted: true,
            transitionDuration: 0,
            elevation: 3,
            getcontentanchorel: null,
            fullwidth: 'true',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: isRTL ? 'left' : 'right',
            },
            transformorigin: {
              vertical: 'top',
              horizontal: isRTL ? 'left' : 'right',
            },
          }}
        />
      )}
      <Popover
        open={Boolean(reactionsAnchor)}
        anchorEl={reactionsAnchor}
        onClose={() => {
          setReactionsAnchor(null);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isRTL ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isRTL ? 'right' : 'left',
        }}
      >
        <EmojiPickerWrapper>
          <EmojiPicker
            onEmojiSelect={(emojiObject: { id: string; native: string }) => {
              onEmojiSelected(emojiObject);
            }}
            showPreview={false}
            showSkinTones={false}
          />
        </EmojiPickerWrapper>
      </Popover>
    </Container>
  );
};

export default ChatMessageToolbar;
