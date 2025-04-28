import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useAgent } from '@credo-ts/react-hooks';
import ShareURLScreen from '@/app/(tabs)/(sharePrescriptions)/ShareURLScreen';
import { useResolvedAuthorizationRequestStore } from '@/state/ResolvedAuthorizationRequestStore';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@credo-ts/react-hooks', () => ({
  useAgent: jest.fn(),
}));
jest.mock('@/state/ResolvedAuthorizationRequestStore', () => ({
  useResolvedAuthorizationRequestStore: jest.fn(),
}));
jest.mock('@/components/URLInputComponent', () => {
  const { TextInput } = require('react-native');
  // @ts-ignore
  return function MockURLInputComponent({ url, onUrlChange }) {
    return (
      <TextInput
        testID="url-input"
        placeholder="https://example.com"
        value={url}
        onChangeText={onUrlChange}
      />
    );
  };
});

describe('ShareURLScreen', () => {
  let mockPush: jest.Mock;
  const mockResolveSiopAuthorizationRequest = jest.fn();
  const mockSetResolvedAuthorizationRequest = jest.fn();

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAgent as jest.Mock).mockReturnValue({
      agent: {
        modules: {
          openId4VcHolderModule: {
            resolveSiopAuthorizationRequest: mockResolveSiopAuthorizationRequest,
          },
        },
      },
    });
    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ set: mockSetResolvedAuthorizationRequest }),
    );
    jest.clearAllMocks();
  });

  test('should render URLInputComponent and Share button', () => {
    const { getByPlaceholderText, getByText } = render(<ShareURLScreen />);
    expect(getByPlaceholderText('https://example.com')).toBeTruthy();
    expect(getByText('Share')).toBeTruthy();
  });

  test('should update input text correctly', () => {
    const { getByPlaceholderText } = render(<ShareURLScreen />);
    const input = getByPlaceholderText('https://example.com');
    fireEvent.changeText(input, 'https://share-link.com');
    expect(input.props.value).toBe('https://share-link.com');
  });

  test('should navigate to ChoosePrescriptionsScreen when share succeeds', async () => {
    const mockResolvedRequest = { authorization: 'mock-data' };
    mockResolveSiopAuthorizationRequest.mockResolvedValue(mockResolvedRequest);

    const { getByText, getByPlaceholderText } = render(<ShareURLScreen />);
    fireEvent.changeText(
      getByPlaceholderText('https://example.com'),
      'https://valid-url.com',
    );
    fireEvent.press(getByText('Share'));

    await waitFor(() => {
      expect(mockResolveSiopAuthorizationRequest).toHaveBeenCalledWith('https://valid-url.com');
      expect(mockSetResolvedAuthorizationRequest).toHaveBeenCalledWith(mockResolvedRequest);
      expect(mockPush).toHaveBeenCalledWith('/ChoosePrescriptionsScreen');
    });
  });

  test('should show loading state while sharing', () => {
    mockResolveSiopAuthorizationRequest.mockImplementation(() => new Promise(() => {}));

    const { getByText, getByPlaceholderText, queryByTestId } = render(<ShareURLScreen />);
    fireEvent.changeText(
      getByPlaceholderText('https://example.com'),
      'https://sharing.com',
    );
    fireEvent.press(getByText('Share'));

    expect(queryByTestId('loading-indicator')).toBeTruthy();
  });

  test('should handle error during share and clear state', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockResolveSiopAuthorizationRequest.mockRejectedValue(new Error('Invalid authorization request'));

    const { getByText, getByPlaceholderText } = render(<ShareURLScreen />);
    fireEvent.changeText(
      getByPlaceholderText('https://example.com'),
      'https://invalid-url.com',
    );
    fireEvent.press(getByText('Share'));

    await waitFor(() => {
      expect(mockResolveSiopAuthorizationRequest).toHaveBeenCalledWith('https://invalid-url.com');
      expect(mockSetResolvedAuthorizationRequest).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(getByPlaceholderText('https://example.com').props.value).toBe('');
    });

    consoleErrorSpy.mockRestore();
  });
});
