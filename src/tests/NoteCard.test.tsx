import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoteCard from '../components/NoteCard';
import { Note } from '../types';

describe('NoteCard', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'This is a test note content',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    ownerUid: 'test-user-id',
  };

  it('renders note title and content', () => {
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();

    render(<NoteCard note={mockNote} onClick={mockOnClick} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note content')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();

    const { container } = render(
      <NoteCard note={mockNote} onClick={mockOnClick} onDelete={mockOnDelete} />
    );

    const card = container.querySelector('.card') as HTMLElement;
    if (card) {
      card.click();
    }

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays "Untitled Note" when title is empty', () => {
    const noteWithoutTitle = { ...mockNote, title: '' };
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();

    render(<NoteCard note={noteWithoutTitle} onClick={mockOnClick} onDelete={mockOnDelete} />);

    expect(screen.getByText('Untitled Note')).toBeInTheDocument();
  });
});
