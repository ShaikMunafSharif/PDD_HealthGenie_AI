package com.healthgenie.ai.ui.screens.emergency

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.EmergencyViewModel

@Composable
fun EmergencyContactsScreen(
    navController: NavHostController,
    viewModel: EmergencyViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .verticalScroll(rememberScrollState()).padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
                }
                SectionHeader(title = "Contacts", eyebrow = "EMERGENCY")
            }
            IconButton(onClick = { navController.navigate(Routes.EMERGENCY_ADD_CONTACT) }) {
                Icon(Icons.Default.PersonAdd, "Add", tint = NeonPulse)
            }
        }

        if (uiState.contacts.isEmpty()) {
            GlassCard(Modifier.fillMaxWidth()) {
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("📋", style = MaterialTheme.typography.displayLarge)
                    Spacer(Modifier.height(16.dp))
                    Text("No contacts yet", style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                    Spacer(Modifier.height(16.dp))
                    NeonButton("Add Contact", { navController.navigate(Routes.EMERGENCY_ADD_CONTACT) }, variant = ButtonVariant.PRIMARY)
                }
            }
        } else {
            uiState.contacts.forEach { contact ->
                GlassCard(Modifier.fillMaxWidth().padding(bottom = 12.dp),
                    borderColor = if (contact.isPrimary) NeonDanger.copy(alpha = 0.4f) else GlassBorder) {
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(contact.name, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                                if (contact.isPrimary) { Spacer(Modifier.width(8.dp)); Text("PRIMARY", style = MaterialTheme.typography.labelSmall, color = NeonDanger) }
                            }
                            Text(contact.phone, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        }
                        IconButton(onClick = { viewModel.deleteContact(contact) }) {
                            Icon(Icons.Default.Delete, "Delete", tint = NeonWarn)
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun EmergencyAddContactScreen(
    navController: NavHostController,
    viewModel: EmergencyViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth))).padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Add Contact", eyebrow = "EMERGENCY")
        }

        GlassCard(Modifier.fillMaxWidth()) {
            GlassInput(uiState.contactName, viewModel::updateContactName, label = "Name", placeholder = "Contact name",
                leadingIcon = { Icon(Icons.Default.Person, null, tint = NeonPulse) })
            Spacer(Modifier.height(16.dp))
            GlassInput(uiState.contactPhone, viewModel::updateContactPhone, label = "Phone", placeholder = "+91 XXXXXXXXXX",
                leadingIcon = { Icon(Icons.Default.Phone, null, tint = NeonPulse) },
                keyboardType = androidx.compose.ui.text.input.KeyboardType.Phone)
            Spacer(Modifier.height(16.dp))
            Text("TYPE", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("personal", "doctor", "emergency").forEach { type ->
                    SelectableChip(type.replaceFirstChar { it.uppercase() }, uiState.contactType == type,
                        { viewModel.updateContactType(type) }, color = NeonDanger)
                }
            }
            Spacer(Modifier.height(16.dp))
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { viewModel.togglePrimary() }) {
                Checkbox(uiState.isPrimary, { viewModel.togglePrimary() }, colors = CheckboxDefaults.colors(checkedColor = NeonDanger))
                Text("Set as primary", style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
            }
        }
        Spacer(Modifier.weight(1f))
        NeonButton("Save Contact", {
            viewModel.saveContact(); navController.popBackStack()
        }, variant = ButtonVariant.PRIMARY, fullWidth = true,
            enabled = uiState.contactName.isNotBlank() && uiState.contactPhone.isNotBlank())
        Spacer(Modifier.height(24.dp))
    }
}
