import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';
import ViewPrescriptions from '../../app/(tabs)/(viewPrescriptions)';

jest.mock('@credo-ts/react-hooks', () => ({
  useAgent: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: jest.fn(),
  };
});

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));
jest.mock('@/components/LoadingComponent', () => {
  const { View } = require('react-native');
  return function MockLoadingComponent() {
    return <View testID="loading-indicator" />;
  };
});

const mockPrescriptions = [
  {
    id: 'cred-1',
    credential: {
      credentialSubject: {
        claims: {
          name: 'Paracetamol',
          activeIngredient: 'Paracetamol',
          authoredOn: '2024-03-20T00:00:00Z',
        },
      },
      issuerId: 'issuer-1',
    },
    createdAt: new Date('2024-03-21'),
  },
  {
    id: 'cred-2',
    credential: {
      credentialSubject: {
        claims: {
          name: 'Ibuprofen',
          activeIngredient: 'Ibuprofen',
          authoredOn: '2024-04-15T00:00:00Z',
        },
      },
      issuerId: 'issuer-2',
    },
    createdAt: new Date('2024-04-16'),
  },
];

const mockIssuerNames = {
  'issuer-1': 'Trusted Health Org',
  'issuer-2': 'PharmaCare',
};

describe('ViewPrescriptions Screen', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });
    (printToFileAsync as jest.Mock).mockResolvedValue({ uri: 'file://prescriptions.pdf' });
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  test('should render prescription name, issuer, and dates correctly', async () => {
    const { getByText, getAllByText } = render(<ViewPrescriptions />);

    const nameMatches = getAllByText('Paracetamol');
    await waitFor(() => {
      expect(nameMatches).toHaveLength(2);
      expect(getByText('Trusted Health Org')).toBeTruthy();
      expect(
        getByText(new Date('3/20/2024').toLocaleDateString()),
      ).toBeTruthy();
      expect(
        getByText(new Date('3/21/2024').toLocaleDateString()),
      ).toBeTruthy();
    });
  });

  test('should disable the download button when no prescription is selected', async () => {
    const { getByRole } = render(<ViewPrescriptions />);

    const downloadBtn = getByRole('button', { name: 'Download' });

    await waitFor(() => {
      expect(downloadBtn?.props.accessibilityState?.disabled).toBe(true);
    });
  });

  test('should enable the download button when prescriptions are selected', async () => {
    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]);

    const downloadBtn = getByRole('button', { name: 'Download' });

    expect(downloadBtn?.props.accessibilityState?.disabled).toBe(false);
  });

  test('should generate and share PDF when download button is pressed', async () => {
    (printToFileAsync as jest.Mock).mockResolvedValue({ uri: 'file://prescriptions.pdf' });
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]); // Select prescription

    const downloadBtn = getByRole('button', { name: 'Download' });
    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(printToFileAsync).toHaveBeenCalledWith({
        html: expect.stringContaining('Prescription Report'),
      });
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith('file://prescriptions.pdf');
    });
  });

  test('should render when no prescriptions are available', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: [], isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: {}, isSuccess: true, isPending: false };
      }
    });

    const { queryAllByRole } = render(<ViewPrescriptions />);

    await waitFor(() => {
      const checkboxes = queryAllByRole('checkbox');
      expect(checkboxes).toHaveLength(0);
    });
  });

  test('should handle multiple prescription selections', async () => {
    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]);
    fireEvent.press(checkboxes[1]);

    const downloadBtn = getByRole('button', { name: 'Download' });
    expect(downloadBtn?.props.accessibilityState?.disabled).toBe(false);
  });

  test('should generate PDF with correct prescription details', async () => {
    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]); // Select first prescription

    const downloadBtn = getByRole('button', { name: 'Download' });
    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(printToFileAsync).toHaveBeenCalledWith({
        html: expect.stringContaining('Trusted Health Org') &&
          expect.stringContaining('Paracetamol') &&
          expect.stringContaining(new Date('2024-03-20').toLocaleDateString()) &&
          expect.stringContaining(new Date('2024-03-21').toLocaleDateString()),
      });
    });
  });
});

describe('ViewPrescriptions error handling', () => {
  test('should display loading indicator when prescriptions data is loading', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: null, isSuccess: false, isPending: true }; // Simulate loading state
      } else if (queryKey[0] === 'issuerNames') {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    render(<ViewPrescriptions />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  test('should display error message when prescriptions data fetch fails', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: null, isSuccess: false, isPending: false }; // Simulate error state
      } else if (queryKey[0] === 'issuerNames') {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    const { getByText } = render(<ViewPrescriptions />);

    expect(getByText('Something went wrong fetching data.')).toBeTruthy();
  });

  test('should display loading indicator when issuer names data is loading', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: null, isSuccess: false, isPending: true };
      }
    });

    render(<ViewPrescriptions />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  test('should display error message when issuer names data fetch fails', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: null, isSuccess: false, isPending: false };
      }
    });

    const { getByText } = render(<ViewPrescriptions />);

    expect(getByText('Something went wrong fetching data.')).toBeTruthy();
  });

  test('should show alert when sharing is unavailable', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    global.alert = jest.fn();
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]);

    const downloadBtn = getByRole('button', { name: 'Download' });
    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

  test('should show alert and console error when printToFileAsync fails', async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'prescription') {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === 'issuerNames') {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    global.alert = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (printToFileAsync as jest.Mock).mockRejectedValue(new Error('Mocked printToFileAsync error'));

    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole('checkbox');
    fireEvent.press(checkboxes[0]);

    const downloadBtn = getByRole('button', { name: 'Download' });
    fireEvent.press(downloadBtn);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Something went wrong while creating the PDF.');
    });

    consoleErrorSpy.mockRestore();
  });

});
