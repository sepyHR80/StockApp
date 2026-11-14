package com.example.androidstockapp

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

@Composable
internal fun AccountScreen(onDemo: () -> Unit) {
    var signingUp by rememberSaveable { mutableStateOf(false) }
    Column(
        Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        PulseBrand()
        PulsePanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                PageTitle(stringResource(if (signingUp) R.string.create_account else R.string.welcome_back))
                Text(
                    stringResource(R.string.account_demo_notice),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                val fields = if (signingUp) {
                    listOf(R.string.name, R.string.email, R.string.password)
                } else {
                    listOf(R.string.email, R.string.password)
                }
                for (label in fields) {
                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        label = { Text(stringResource(label)) },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = false,
                        shape = MaterialTheme.shapes.medium,
                    )
                }
                Button(onClick = {}, enabled = false, modifier = Modifier.fillMaxWidth()) {
                    Text(stringResource(if (signingUp) R.string.sign_up else R.string.sign_in))
                }
                OutlinedButton(onClick = {}, enabled = false, modifier = Modifier.fillMaxWidth()) {
                    Text(stringResource(R.string.continue_with_google))
                }
                TextButton(onClick = { signingUp = !signingUp }, modifier = Modifier.fillMaxWidth()) {
                    Text(stringResource(if (signingUp) R.string.sign_in else R.string.create_account))
                }
            }
        }
        PulseButton(stringResource(R.string.continue_demo), onDemo)
    }
}
