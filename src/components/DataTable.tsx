import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { AnimatedCard } from './AnimatedCard';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  onRowClick,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortDirection,
  onSort,
  loading = false,
}: DataTableProps<T>) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    if (sortKey === key) {
      onSort(key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const getCellValue = (row: T, column: Column<T>) => {
    const value = row[column.key as keyof T];
    return column.render ? column.render(value, row) : value;
  };

  return (
    <AnimatedCard enableHover={false} style={{ padding: 0, overflow: 'hidden' as any }}>
      {/* Table Header */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        padding: 16,
      }}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => column.sortable !== false && handleSort(String(column.key))}
            disabled={column.sortable === false}
            style={{
              width: column.width || `${100 / columns.length}%`,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              cursor: column.sortable !== false ? 'pointer' : 'default',
            }}
          >
            <Text style={{
              color: colors.textPrimary,
              fontSize: parseInt(typography.fontSize.small),
              fontWeight: '600',
              fontFamily: typography.fontFamily.heading,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              {column.title}
            </Text>
            
            {column.sortable !== false && sortKey === column.key && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d={sortDirection === 'asc' ? 'M6 3l3 4H3l3-4z' : 'M6 9l3-4H3l3 4z'}
                  fill={colors.accent}
                />
              </svg>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Table Body */}
      <ScrollView style={{ maxHeight: 600 }}>
        {loading ? (
          <View style={{ padding: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader" />
          </View>
        ) : data.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>No data available</Text>
          </View>
        ) : (
          data.map((row, rowIndex) => (
            <TouchableOpacity
              key={rowIndex}
              onPress={() => onRowClick && onRowClick(row)}
              style={{
                flexDirection: 'row',
                padding: 16,
                borderBottomWidth: rowIndex < data.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
              }}
              onHoverIn={(e: any) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = colors.surfaceElev;
                }
              }}
              onHoverOut={(e: any) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {columns.map((column, colIndex) => (
                <View
                  key={colIndex}
                  style={{
                    width: column.width || `${100 / columns.length}%`,
                    justifyContent: 'center',
                    alignItems: column.align === 'right' ? 'flex-end' : column.align === 'center' ? 'center' : 'flex-start',
                  }}
                >
                  {getCellValue(row, column)}
                </View>
              ))}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Pagination Footer */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        {/* Page Size Selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{
            color: colors.textSecondary,
            fontSize: parseInt(typography.fontSize.small),
            fontFamily: typography.fontFamily.body,
          }}>
            Rows per page:
          </Text>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              backgroundColor: colors.surfaceCard,
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: parseInt(colors.borderRadius.small),
              fontSize: typography.fontSize.small,
              fontFamily: typography.fontFamily.body,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </View>

        {/* Pagination Info */}
        <Text style={{
          color: colors.textSecondary,
          fontSize: parseInt(typography.fontSize.small),
          fontFamily: typography.fontFamily.body,
        }}>
          {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </Text>

        {/* Pagination Controls */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              backgroundColor: colors.surfaceCard,
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: parseInt(colors.borderRadius.small),
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              fontSize: typography.fontSize.small,
              fontFamily: typography.fontFamily.body,
              transition: 'all 0.2s ease',
            }}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => onPageChange(pageNum)}
                style={{
                  padding: '8px 12px',
                  minWidth: 40,
                  backgroundColor: currentPage === pageNum ? colors.accent : colors.surfaceCard,
                  color: currentPage === pageNum ? '#ffffff' : colors.textPrimary,
                  border: `1px solid ${currentPage === pageNum ? colors.accent : colors.border}`,
                  borderRadius: parseInt(colors.borderRadius.small),
                  cursor: 'pointer',
                  fontSize: typography.fontSize.small,
                  fontFamily: typography.fontFamily.body,
                  fontWeight: currentPage === pageNum ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              backgroundColor: colors.surfaceCard,
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: parseInt(colors.borderRadius.small),
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              fontSize: typography.fontSize.small,
              fontFamily: typography.fontFamily.body,
              transition: 'all 0.2s ease',
            }}
          >
            Next
          </button>
        </View>
      </View>
    </AnimatedCard>
  );
}

