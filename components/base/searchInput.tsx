import { X } from '@tamagui/lucide-icons';
import React, { useEffect, useState, useRef } from 'react';
import { TextInput, Keyboard } from 'react-native';
import { XStack, Input, Paragraph, AnimatePresence, View, Button } from 'tamagui';

interface SearchInputProps {
  placeholder: string;
  onSearchChange: (searchText) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearchChange }) => {
  const [text, setText] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setShowCancel(text !== '');
    onSearchChange(text);
  }, [text]);

  const handleCancel = () => {
    setText('');
    handleOutsideClick();
  };

  const handleOutsideClick = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <XStack width="100%" pos="relative" ai="center" gap="$4" paddingHorizontal="$4">
      {showCancel && (
        <Button
          key="inputCancel"
          icon={X}
          r="$4"
          zi={10}
          pos="absolute"
          backgroundColor="$colorTransparent"
          borderColor="$colorTransparent"
          onPress={handleCancel}
          animation="medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
      )}
      <Input
        f={1}
        key="inputSearch"
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
      />
    </XStack>
  );
};

export default SearchInput;
