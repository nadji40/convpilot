import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { Portal } from './Portal';

interface TechnicalDocumentationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TechnicalDocumentationModal = ({ isVisible, onClose }: TechnicalDocumentationModalProps) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (!isVisible) return null;

  return (
    <Portal>
      <View 
        className="modal-overlay"
        onPress={onClose}
        style={{
          position: 'fixed' as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 2147483647,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          display: 'flex',
        }}
      >
      <TouchableOpacity 
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
        className="modal-content"
        style={{
          width: '90%',
          maxWidth: 900,
          maxHeight: '90%',
          backgroundColor: isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          overflow: 'hidden' as any,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
          animation: 'fadeInScale 0.3s ease-out',
          zIndex: 2147483647,
          position: 'relative' as any,
        }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 24,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: isDark ? 'rgba(0, 212, 170, 0.1)' : 'rgba(0, 212, 170, 0.1)',
        }}>
          <Text style={{
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: '900',
            fontFamily: 'Playfair Display',
          }}>
            Document Technique – CONVPILOT
          </Text>
          <TouchableOpacity onPress={onClose} style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}>
            <Text style={{ color: colors.textSecondary, fontSize: 20, fontWeight: '600' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 24 }}>
          {/* Section 1 */}
          <View>
            <Text style={{
              color: colors.accentBlue,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              1. Présentation du système
            </Text>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontFamily: 'Playfair Display',
              lineHeight: 22,
              marginBottom: 12,
            }}>
              ConvPilot est une plateforme d'analyse journalière et de suivi des obligations convertibles (OC).
            </Text>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontFamily: 'Playfair Display',
              lineHeight: 22,
              marginBottom: 12,
            }}>
              L'objectif est de proposer un outil modulaire, évolutif, capable d'agréger et de visualiser des données financières complexes — d'abord sur données fictives, puis sur données réelles issues de Bloomberg API.
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(74, 158, 255, 0.1)' : 'rgba(74, 158, 255, 0.1)',
              padding: 16,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: colors.accentBlue,
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontFamily: 'Playfair Display',
                fontWeight: '600',
                marginBottom: 8,
              }}>
                Phases du projet :
              </Text>
              <Text style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontFamily: 'Playfair Display',
                lineHeight: 20,
              }}>
                • Phase 1 (MVP) : développement d'un prototype fonctionnel sur données simulées{'\n'}
                • Phase 2 : intégration des données Bloomberg en temps réel
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View>
            <Text style={{
              color: colors.accentGreen,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              2. Architecture générale du système
            </Text>
            
            <Text style={{
              color: colors.accentGreen,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Playfair Display',
              marginBottom: 8,
            }}>
              A. Phase 1 – Données fictives (MVP)
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(42, 42, 42, 0.8)' : 'rgba(248, 249, 250, 0.8)',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 13,
                fontFamily: 'monospace',
                lineHeight: 20,
              }}>
                [Excel Fields & Fichiers Fictifs]{'\n'}
                        ↓{'\n'}
                [Base de données ConvPilot]{'\n'}
                        ↓{'\n'}
                [API interne – NestJS (V0)]{'\n'}
                        ↓{'\n'}
                [Dashboard Web (ReactNative)]
              </Text>
            </View>

            <Text style={{
              color: colors.accentGreen,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Playfair Display',
              marginBottom: 8,
            }}>
              B. Phase 2 – Données réelles Bloomberg
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(42, 42, 42, 0.8)' : 'rgba(248, 249, 250, 0.8)',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 13,
                fontFamily: 'monospace',
                lineHeight: 20,
              }}>
                [Bloomberg API / Terminal Data Feed]{'\n'}
                        ↓{'\n'}
                [Module d'Ingestion & Nettoyage des Données]{'\n'}
                        ↓{'\n'}
                [Base de données ConvPilot]{'\n'}
                     ↙             ↘{'\n'}
                [Historique OC]     [Données Agrégées]{'\n'}
                        ↓{'\n'}
                [API (V1) + Calculs Financiers]{'\n'}
                        ↓{'\n'}
                [Dashboard Web]
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View>
            <Text style={{
              color: colors.accentOrange,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              3. Typologie des données
            </Text>
            
            <View style={{ gap: 16 }}>
              <View>
                <Text style={{
                  color: colors.accentOrange,
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Playfair Display',
                  marginBottom: 8,
                }}>
                  3.1. Données statiques
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  fontFamily: 'Playfair Display',
                  lineHeight: 22,
                  marginBottom: 8,
                }}>
                  Ces données décrivent les caractéristiques fixes d'une obligation convertible :
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontFamily: 'Playfair Display',
                  lineHeight: 20,
                }}>
                  • Émetteur, ISIN, devise{'\n'}
                  • Coupon, échéance, ratio de conversion{'\n'}
                  • Clauses (call, put), rating, secteur, pays
                </Text>
              </View>

              <View>
                <Text style={{
                  color: colors.accentOrange,
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Playfair Display',
                  marginBottom: 8,
                }}>
                  3.2. Données dynamiques
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  fontFamily: 'Playfair Display',
                  lineHeight: 22,
                  marginBottom: 8,
                }}>
                  Données de marché actualisées chaque jour :
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontFamily: 'Playfair Display',
                  lineHeight: 20,
                }}>
                  • Prix, volatilité, valeur théorique, rendement{'\n'}
                  • Sensibilité (delta, gamma, vega, theta){'\n'}
                  • Spread de crédit, cours de l'action sous-jacente
                </Text>
              </View>
            </View>
          </View>

          {/* Section 4 */}
          <View>
            <Text style={{
              color: colors.accentPurple,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              4. Structure de la base de données
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{
                backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.accentPurple,
              }}>
                <Text style={{
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontFamily: 'Playfair Display',
                  fontWeight: '600',
                }}>
                  4.1. Table principale : convertible_bonds
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontFamily: 'Playfair Display',
                }}>
                  Contient toutes les informations statiques (émission, clauses, rating…).
                </Text>
              </View>
              <View style={{
                backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.accentPurple,
              }}>
                <Text style={{
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontFamily: 'Playfair Display',
                  fontWeight: '600',
                }}>
                  4.2. Table secondaire : daily_data
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontFamily: 'Playfair Display',
                }}>
                  Historique des champs dynamiques calculés ou importés par le client (prix, delta, fair value…).
                </Text>
              </View>
            </View>
          </View>

          {/* Section 5 */}
          <View>
            <Text style={{
              color: colors.accentPink,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              5. Agrégations et filtres
            </Text>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontFamily: 'Playfair Display',
              lineHeight: 22,
              marginBottom: 12,
            }}>
              ConvPilot doit permettre des analyses croisées dynamiques entre plusieurs dimensions.
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(42, 42, 42, 0.8)' : 'rgba(248, 249, 250, 0.8)',
              padding: 16,
              borderRadius: 12,
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 13,
                fontFamily: 'monospace',
                lineHeight: 20,
              }}>
                [Daily Data Table]{'\n'}
                        ↓{'\n'}
                [Module d'agrégation (NestJS/SQL)]{'\n'}
                        ↓{'\n'}
                [Aggregations Service]{'\n'}
                        ↓{'\n'}
                [API / Filters Frontend]{'\n'}
                        ↓{'\n'}
                [Dashboard interactif]
              </Text>
            </View>
          </View>

          {/* Section 6 */}
          <View>
            <Text style={{
              color: colors.accentBlue,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              6. Interface et fonctionnalités attendues (Phase 1)
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(74, 158, 255, 0.1)' : 'rgba(74, 158, 255, 0.1)',
              padding: 16,
              borderRadius: 12,
            }}>
              <Text style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontFamily: 'Playfair Display',
                lineHeight: 20,
              }}>
                • Vue d'ensemble (Overview) : principaux indicateurs et graphiques{'\n'}
                • Vue instrument : fiche détaillée d'une obligation convertible{'\n'}
                • Vue portefeuille : liste + agrégations simples{'\n'}
                • Filtres dynamiques : secteur, profil, maturité, taille, rating{'\n'}
                • Données fictives mais réalistes, issues du fichier Excel
              </Text>
            </View>
          </View>

          {/* Section 7 */}
          <View>
            <Text style={{
              color: colors.accentGreen,
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 12,
            }}>
              7. Délivrables – Phase 1 (Prototype fonctionnel)
            </Text>
            <View style={{
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              padding: 16,
              borderRadius: 12,
            }}>
              <Text style={{
                color: colors.accentGreen,
                fontSize: 14,
                fontFamily: 'Playfair Display',
                fontWeight: '600',
                marginBottom: 8,
              }}>
                Durée totale estimée : 3-4 semaines
              </Text>
              <Text style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontFamily: 'Playfair Display',
                lineHeight: 20,
              }}>
                1. Base de données structurée (5 jours){'\n'}
                2. Générateur de données fictives (3 jours){'\n'}
                3. API interne (NestJS/API) (7 jours){'\n'}
                4. Dashboard (React Native) (10 jours){'\n'}
                5. Tests, déploiement & documentation (5 jours)
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={{
            backgroundColor: isDark ? 'rgba(0, 212, 170, 0.1)' : 'rgba(0, 212, 170, 0.1)',
            padding: 20,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.accentGreen,
            marginTop: 16,
          }}>
            <Text style={{
              color: colors.accentGreen,
              fontSize: 16,
              fontWeight: '700',
              fontFamily: 'Playfair Display',
              marginBottom: 8,
            }}>
              🎯 Objectif de la Phase 1
            </Text>
            <Text style={{
              color: colors.textPrimary,
              fontSize: 14,
              fontFamily: 'Playfair Display',
              lineHeight: 22,
            }}>
              La Phase 1 permettra à ConvPilot de tester l'ergonomie et la structure du produit, présenter une démo fonctionnelle aux partenaires financiers, et préparer une base technique solide pour l'intégration Bloomberg.
            </Text>
          </View>
        </ScrollView>
      </TouchableOpacity>
    </View>
    </Portal>
  );
};
