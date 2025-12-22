// Small utility helpers around node identities and types to avoid scattering string checks
import { QUALITY_ROOT_ID, NODE_TYPES } from './constants';

/**
 * @typedef {Object} QNode
 * @property {string} id
 * @property {string} [qualityType] - one of 'quality' | 'requirement' | 'standard' | 'property'
 */

export const isRootId = (id) => id === QUALITY_ROOT_ID;
export const isRoot = (node) => !!node && isRootId(node.id);

export const getNodeType = (node) => (node && node.qualityType) || null;

export const isQuality = (node) => getNodeType(node) === NODE_TYPES.QUALITY;
export const isRequirement = (node) => getNodeType(node) === NODE_TYPES.REQUIREMENT;
export const isStandard = (node) => getNodeType(node) === NODE_TYPES.STANDARD;
export const isProperty = (node) => getNodeType(node) === NODE_TYPES.PROPERTY;
