import { render, fireEvent } from '@testing-library/react';
import Composer from './Composer';

describe('Composer', () => {
  it('renders textarea and seal button', () => {
    const { getByPlaceholderText, getByLabelText } = render(<Composer onSend={() => {}} />);
    expect(getByPlaceholderText(/entrust to the vault/i)).toBeInTheDocument();
    expect(getByLabelText('Seal This Message')).toBeInTheDocument();
  });

  it('calls onSend when message is sealed', () => {
    const onSend = jest.fn();
    const { getByLabelText } = render(<Composer onSend={onSend} />);
    const textarea = getByLabelText('Seal This Message').closest('div')?.querySelector('textarea');
    expect(textarea).not.toBeNull();
    fireEvent.change(textarea as HTMLTextAreaElement, { target: { value: 'Secret' } });
    fireEvent.click(getByLabelText('Seal This Message'));
    setTimeout(() => {
      expect(onSend).toHaveBeenCalledWith('Secret');
    }, 700);
  });
});
