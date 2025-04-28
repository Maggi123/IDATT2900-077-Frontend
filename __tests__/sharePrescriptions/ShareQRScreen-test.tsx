import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { useAgent } from '@credo-ts/react-hooks';
import ShareQRScreen from '@/app/(tabs)/(sharePrescriptions)/ShareQRScreen';
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
jest.mock('@/components/QRCodeScannerComponent', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');

  return function MockQRCodeScanner({ onScan }) {
    return React.createElement(
      TouchableOpacity,
      {
        testID: 'qr-scanner',
        onPress: () => onScan('mock-qr-data'),
      },
      React.createElement(Text, null, 'Scan QR Code'),
    );
  };
});

describe('ShareQRScreen', () => {
  const mockRouter = { push: jest.fn() };
  const mockSetResolvedAuthorizationRequest = jest.fn();
  const mockResolveSiopAuthorizationRequest = jest.fn();
  const mockAgent = {
    agent: {
      modules: {
        openId4VcHolderModule: {
          resolveSiopAuthorizationRequest: mockResolveSiopAuthorizationRequest,
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAgent as jest.Mock).mockReturnValue(mockAgent);
    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementation(
      (selector) => selector({ set: mockSetResolvedAuthorizationRequest }),
    );
  });

  test('should render QRCodeScannerComponent when not in sharing state', () => {
    const { getByTestId } = render(<ShareQRScreen />);
    expect(getByTestId('qr-scanner')).toBeTruthy();
  });

  test('should render LoadingComponent when in sharing state', async () => {
    // Create a promise that doesn't resolve immediately to keep sharingState true
    const delayedPromise = new Promise(() => {});
    mockResolveSiopAuthorizationRequest.mockReturnValue(delayedPromise);

    const { getByTestId, findByTestId } = render(<ShareQRScreen />);

    // Simulate QR code scan by pressing the scanner button
    fireEvent.press(getByTestId('qr-scanner'));

    // Wait for the LoadingComponent to appear
    await findByTestId('loading-indicator');
  });

  test('should handle QR code scan success and navigate to ChoosePrescriptionsScreen', async () => {
    const mockAuthorizationRequest = { id: 'test-request' };
    mockResolveSiopAuthorizationRequest.mockResolvedValue(mockAuthorizationRequest);

    const { getByTestId } = render(<ShareQRScreen />);

    fireEvent.press(getByTestId('qr-scanner'));

    await waitFor(() => {
      expect(mockResolveSiopAuthorizationRequest).toHaveBeenCalledWith('mock-qr-data');
      expect(mockSetResolvedAuthorizationRequest).toHaveBeenCalledWith(mockAuthorizationRequest);
      expect(mockRouter.push).toHaveBeenCalledWith('/ChoosePrescriptionsScreen');
    });
  });

  test('should handle error during authorization request resolution', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockResolveSiopAuthorizationRequest.mockRejectedValue(new Error('Resolution failed'));

    const { getByTestId } = render(<ShareQRScreen />);

    fireEvent.press(getByTestId('qr-scanner'));

    await waitFor(() => {
      expect(mockResolveSiopAuthorizationRequest).toHaveBeenCalledWith('mock-qr-data');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test('should clear state after processing QR code', async () => {
    mockResolveSiopAuthorizationRequest.mockResolvedValue({ id: 'test-request' });

    const { getByTestId } = render(<ShareQRScreen />);

    fireEvent.press(getByTestId('qr-scanner'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/ChoosePrescriptionsScreen');
      expect(getByTestId('qr-scanner')).toBeTruthy();
    });
  });
});
